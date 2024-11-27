import React from "react";

interface Message {
  from: string;
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`my-2 p-2 rounded-lg ${
            msg.from === "usuario1" ? "bg-blue-500 self-end" : "bg-gray-700"
          }`}
        >
          <strong>{msg.from}: </strong>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
