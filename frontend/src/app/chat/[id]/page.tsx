"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

const users = [
  { id: 1, user: "operador" },
  { id: 2, user: "tecnico" },
  { id: 3, user: "gerente" },
];

export default function Chat() {
  const router = useRouter();
  const { id } = useParams();
  const [messages, setMessages] = useState<{ from: string; content: string }[]>(
    []
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    user: string;
   } | null>(null);

  useEffect(() => {
    if (!id) return;

    const user = localStorage.getItem("loggedUser");
    const currentUsers = users.find((item) => item.user === user);

    if (currentUsers) {
      setCurrentUser(currentUsers);
    } else {
      router.push("/login");
    }

    const serverHost = process.env.SERVER_HOST || 'localhost'
    const ws = io(`http://${serverHost}:3001`, { transports: ["websocket"] });
    setSocket(ws);
  
    ws.on("connect", () => {
      console.log("Conectado ao WebSocket");

      ws.emit("register", JSON.stringify({ 
        type: "register", 
        user: currentUsers?.id, 
        name: currentUsers?.user 
      }));
    });

    ws.on("message", (event) => {
      const data = JSON.parse(event);
      const userId = users.find((item) => item.user === data.from)?.id
      setMessages((prev) => [...prev, data]);
      // if (data.type === "message" && Number(userId) === Number(id)) {
      //   setMessages((prev) => [...prev, data]);
      // }
    });

    setSocket(ws)

    return () => {
      if (ws) {
        ws.disconnect();
        console.log("Desconectado do WebSocket");
      }
    };
  }, [id]);

  interface Message {
    from: string;
    content: string;
  }

  interface WebSocketMessage {
    type: string;
    user?: string;
    to?: string;
    from?: string;
    content?: string;
  }

  const sendMessage = (content: string) => {
    if (socket && id) {
      const message: WebSocketMessage = {
        type: "message",
        to: id as string,
        from: currentUser?.user,
        content,
      };
      socket.send(JSON.stringify(message));
      setMessages((prev: Message[]) => [
        ...prev,
        { from: currentUser!.user, content },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex justify-between items-center bg-gray-800 p-4">
        <h1 className="text-xl font-bold">
          Chat com {users.find((item) => item.id === Number(id))?.user}
        </h1>
        <button
          onClick={() => router.push("/")}
          className="bg-red-500 px-4 py-2 rounded-lg text-white"
        >
          Voltar
        </button>
      </div>
      <div className="flex-1 flex flex-col p-4">
        <MessageList messages={messages} />
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
}
