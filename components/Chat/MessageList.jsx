import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, user, teamMembers }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" style={{ height: "calc(100% - 144px)" }}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} user={user} teamMembers={teamMembers} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
