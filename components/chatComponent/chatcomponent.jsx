"use client";

import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
    ChatList, ChatCard, NewChatForm,
    ChatFeed, ChatHeader, MessageBubble, IsTyping, ConnectionBar, ScrollDownBar,
    NewMessageForm, ChatSettings, ChatSettingsTop, PeopleSettings, PhotosSettings, OptionsSettings
} from "react-chat-engine";

const ChatEngine = dynamic(
    () => import("react-chat-engine").then((module) => module.ChatEngine),
    {
        ssr: false,
        loading: () => <p>Loading Chat...</p>,
    }
);

// Wrapper components for customization
const CustomChatList = (props) => (
    <div className="custom-chat-list">
        <ChatList {...props} />
    </div>
);

const CustomChatCard = (props) => (
    <div className="custom-chat-card">
        <ChatCard {...props} />
    </div>
);

const CustomNewChatForm = (props) => (
    <div className="custom-new-chat-form">
        <NewChatForm {...props} />
    </div>
);

const CustomChatFeed = (props) => (
    <div className="custom-chat-feed">
        <ChatFeed {...props} />
    </div>
);

const CustomChatHeader = (props) => (
    <div className="custom-chat-header">
        <ChatHeader {...props} />
    </div>
);

const CustomMessageBubble = (props) => (
    <div className="custom-message-bubble">
        <MessageBubble {...props} />
    </div>
);

const CustomIsTyping = (props) => (
    <div className="custom-is-typing">
        <IsTyping {...props} />
    </div>
);

const CustomConnectionBar = (props) => (
    <div className="custom-connection-bar">
        <ConnectionBar {...props} />
    </div>
);

const CustomScrollDownBar = (props) => (
    <div className="custom-scroll-down-bar">
        <ScrollDownBar {...props} />
    </div>
);

const CustomNewMessageForm = (props) => (
    <div className="custom-new-message-form">
        <NewMessageForm {...props} />
    </div>
);

const CustomChatSettings = (props) => (
    <div className="custom-chat-settings">
        <ChatSettings {...props} />
    </div>
);

const CustomChatSettingsTop = (props) => (
    <div className="custom-chat-settings-top">
        <ChatSettingsTop {...props} />
    </div>
);

const CustomPeopleSettings = (props) => (
    <div className="custom-people-settings">
        <PeopleSettings {...props} />
    </div>
);

const CustomPhotosSettings = (props) => (
    <div className="custom-photos-settings">
        <PhotosSettings {...props} />
    </div>
);

const CustomOptionsSettings = (props) => (
    <div className="custom-options-settings">
        <OptionsSettings {...props} />
    </div>
);

export default function ChatComponent({userName, userSecret}) {
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShowChat(true);
        }
    }, []);

    if (!showChat)
        return (
            <div className="flex justify-center items-center h-[75vh]">
                <div className="rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
            </div>
        );

    return (
        <div className="chat-container">
            <ChatEngine
                height="75vh"
                projectID={process.env.NEXT_PUBLIC_CHAT_ENGINE_PROJECT_ID}
                userName={userName}
                userSecret={userSecret}
                renderChatList={(chatAppState) => <CustomChatList {...chatAppState} />}
                renderChatCard={(chat, index) => <CustomChatCard chat={chat}/>}
                renderNewChatForm={(creds) => <CustomNewChatForm creds={creds}/>}
                renderChatFeed={(chatAppState) => <CustomChatFeed {...chatAppState} />}
                renderChatHeader={(chat) => <CustomChatHeader chat={chat}/>}
                renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) => (
                    <CustomMessageBubble
                        lastMessage={lastMessage}
                        message={message}
                        nextMessage={nextMessage}
                        chat={chat}
                    />
                )}
                renderIsTyping={(typers) => <CustomIsTyping/>}
                renderConnectionBar={(chat) => <CustomConnectionBar/>}
                renderScrollDownBar={(chat) => <CustomScrollDownBar chat={chat}/>}
                renderNewMessageForm={(creds, chatId) => <CustomNewMessageForm creds={creds} chatId={chatId}/>}
                renderChatSettings={(chatAppProps) => <CustomChatSettings {...chatAppProps} />}
                renderChatSettingsTop={(creds, chat) => <CustomChatSettingsTop creds={creds} chat={chat}/>}
                renderPeopleSettings={(creds, chat) => <CustomPeopleSettings creds={creds} chat={chat}/>}
                renderPhotosSettings={(chat) => <CustomPhotosSettings chat={chat}/>}
                renderOptionsSettings={(creds, chat) => <CustomOptionsSettings creds={creds} chat={chat}/>}
            />
        </div>
    );
}