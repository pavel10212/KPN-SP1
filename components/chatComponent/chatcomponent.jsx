"use client";

import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Avatar} from "react-chat-engine";


const ChatEngine = dynamic(
    () => import("react-chat-engine").then((module) => module.ChatEngine),
    {
        ssr: false,
        loading: () => <p>Loading Chat...</p>,
    }
);

const MessageFormSocial = dynamic(() =>
    import("react-chat-engine").then((module) => module.MessageFormSocial)
);

export default function ChatComponent({userName, userSecret, user}) {
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShowChat(true);
        }
    }, []);

    if (!showChat)
        return (
            <div className="flex justify-center items-center h-[75vh]">
                <div className="rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );

    return (
        <div className="chat-container">
            <ChatEngine
                height="75vh"
                projectID={process.env.NEXT_PUBLIC_CHAT_ENGINE_PROJECT_ID}
                userName={userName}
                userSecret={userSecret}
                renderNewMessageForm={() => <MessageFormSocial/>}
                renderAvatar={() => <Avatar username={userName} avatar={user.image}/>}
            />
            <style jsx global>{`
                .chat-container {
                    font-family: "Inter", sans-serif;
                }

                .ce-chat-list {
                    background-color: #f3f4f6 !important;
                }

                .ce-chats-container {
                    background-color: #f3f4f6 !important;
                    border-right: 1px solid #e5e7eb;
                }

                .ce-active-chat-card {
                    background-color: #ffffff !important;
                    border: 1px solid #e5e7eb !important;
                }

                .ce-chat-title-text {
                    color: #1f2937 !important;
                }

                .ce-chat-subtitle-text {
                    color: #6b7280 !important;
                }

                .ce-chat-form-container {
                    background-color: #ffffff !important;
                    border-top: 1px solid #e5e7eb;
                    font-family: sans-serif;
                    font-size: 10px;
                }

                #ce-send-message-button {
                    background-color: #4f46e5 !important;
                }

                .ce-my-message-bubble {
                    background-color: #4f46e5 !important;
                }

                .ce-my-message-sinding-bubble {
                    background-color: #818cf8 !important;
                }

                .ce-their-message-bubble {
                    background-color: #e5e7eb !important;
                    color: #1f2937 !important;
                }

                #ce-send-message-button {
                    background-color: #4f46e5 !important;
                }

                .ce-autocomplete-input {
                    border-radius: 6px !important;
                    border: 1px solid #e5e7eb;
                }

                .ce-danger-button {
                    background-color: #ef4444 !important;
                }

                .ce-primary-button {
                    background-color: #4f46e5 !important;
                }

                .ce-settings-container {
                    font-family: sans-serif;
                    font-weight: 200;
                    font-size: 10px;
                }

                .ce-chat-card {
                    font-family: sans-serif;
                }
            `}</style>
        </div>
    );
}
