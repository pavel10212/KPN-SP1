// app/chat/ChatComponent.js
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChatEngine = dynamic(() =>
  import("react-chat-engine").then((module) => module.ChatEngine)
);

const MessageFormSocial = dynamic(() =>
  import("react-chat-engine").then((module) => module.MessageFormSocial)
);

export default function ChatComponent({ userName, userSecret }) {
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShowChat(true);
    }
  }, []);

  if (!showChat) return <div>Loading...</div>;

  return (
    <div>
      <ChatEngine
        height="75vh"
        projectID={process.env.NEXT_PUBLIC_CHAT_ENGINE_PROJECT_ID}
        userName={userName}
        userSecret={userSecret}
        renderNewMessageForm={() => <MessageFormSocial />}
      />
    </div>
  );
}
