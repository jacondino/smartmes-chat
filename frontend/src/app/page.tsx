"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const users = [
  { id: 1, user: "operador" },
  { id: 2, user: "tecnico" },
  { id: 3, user: "gerente" },
];

export default function Home() {
  const [loggedUser, setLoggedUser] = useState<{
    id: number;
    user: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("loggedUser");
    const findUser = users.find((item) => item.user === user);

    if (findUser) {
      setLoggedUser(findUser);
    }

    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      {loggedUser ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Bem-vindo, {loggedUser.user}!
          </h1>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h1 className="text-xl font-bold mb-4">Usuários Disponíveis</h1>
            <ul className="space-y-2">
              {users
                .filter((user) => user.user !== loggedUser.user)
                .map((user) => (
                  <li
                    key={user.id}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                  >
                    <span>{user.user}</span>
                    <Link
                      href={`/chat/${user.id}`}
                      className="bg-blue-500 px-4 py-2 rounded-lg text-white"
                    >
                      Chat
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg text-white font-bold"
          >
            Sair
          </button>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}
