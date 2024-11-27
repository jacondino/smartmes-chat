"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const users = [
  { id: 1, user: "operador" },
  { id: 2, user: "tecnico" },
  { id: 3, user: "gerente" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isUser = users.some((user) => user.user === username);
    const fixedPassword = "123456";

    if (password === fixedPassword && isUser) {
      localStorage.setItem("loggedUser", username);
      router.push("/");
    } else {
      alert("Senha incorreta! Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-1/3"
      >
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block mb-2">Nome de Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded-lg text-white outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 rounded-lg text-white outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 p-2 rounded-lg text-white font-bold"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
