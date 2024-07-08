declare module "react-chat-engine" {
  import React from "react";

  export interface ChatEngineProps {
    projectID: string;
    userName: string;
    userSecret: string;
    renderNewMessageForm?: () => React.ReactNode;
    height?: string;
  }

  export const ChatEngine: React.FC<ChatEngineProps>;

  export const MessageFormSocial: React.FC;

  // Add other exports from react-chat-engine as needed
}
