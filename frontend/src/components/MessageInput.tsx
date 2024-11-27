import React, { useState } from "react";

interface MessageInputProps {
  sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (content.trim()) {
      sendMessage(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Digite sua mensagem..."
        className="flex-1 p-2 bg-gray-800 text-white rounded-l-lg outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 px-4 py-2 rounded-r-lg text-white"
      >
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;
