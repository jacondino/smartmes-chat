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

    // Configura o WebSocket, conectando ao servidor.
    const serverHost = process.env.SERVER_HOST || "localhost";
    const ws = io(`http://${serverHost}:3001`, { transports: ["websocket"] });
    setSocket(ws);

    // Evento de conexão ao WebSocket.
    ws.on("connect", () => {
      console.log("Conectado ao WebSocket");

      // Registra o usuário no servidor WebSocket.
      ws.emit(
        "register",
        JSON.stringify({
          type: "register",
          user: currentUsers?.id,
          name: currentUsers?.user,
        })
      );
    });

    // Evento para receber mensagens do servidor.
    ws.on("message", (event) => {
      const data = JSON.parse(event); // Converte a mensagem recebida para JSON.
      setMessages((prev) => [...prev, data]);
    });

    setSocket(ws);

    return () => {
      // Cleanup: desconecta do WebSocket ao desmontar o componente.
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
    to: string;
    from: string | undefined;
    content: string;
  }

  // Função para enviar mensagens.
  const sendMessage = (content: string) => {
    if (socket && id) {
      const message: WebSocketMessage = {
        type: "message",
        to: id as string,
        from: currentUser?.user,
        content,
      };
      socket.send(JSON.stringify(message)); // Envia a mensagem via WebSocket.
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
