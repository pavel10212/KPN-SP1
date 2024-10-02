"use client";

import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
    ChatList, ChatCard, NewChatForm, ChatFeed, ChatHeader,
    MessageBubble, IsTyping, ScrollDownBar, NewMessageForm,
    ChatSettings, ChatSettingsTop, PeopleSettings, PhotosSettings, OptionsSettings
} from "react-chat-engine";

const ChatEngine = dynamic(
    () => import("react-chat-engine").then((module) => module.ChatEngine),
    {ssr: false, loading: () => <p>Loading Chat...</p>}
);

const CustomComponent = ({Component, className, ...props}) => (
    <div className={className}>
        <Component {...props} />
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
                renderChatList={(chatAppState) => <CustomComponent Component={ChatList}
                                                                   className="custom-chat-list" {...chatAppState} />}
                renderChatCard={(chat) => <CustomComponent Component={ChatCard} className="custom-chat-card"
                                                           chat={chat}/>}
                renderNewChatForm={(creds) => <CustomComponent Component={NewChatForm} className="custom-new-chat-form"
                                                               creds={creds}/>}
                renderChatFeed={(chatAppState) => <CustomComponent Component={ChatFeed}
                                                                   className="custom-chat-feed" {...chatAppState} />}
                renderChatHeader={(chat) => <CustomComponent Component={ChatHeader} className="custom-chat-header"
                                                             chat={chat}/>}
                renderMessageBubble={(creds, chat, lastMessage, message, nextMessage) => (
                    <CustomComponent
                        Component={MessageBubble}
                        className="custom-message-bubble"
                        lastMessage={lastMessage}
                        message={message}
                        nextMessage={nextMessage}
                        chat={chat}
                    />
                )}
                renderIsTyping={() => <CustomComponent Component={IsTyping} className="custom-is-typing"/>}
                renderScrollDownBar={(chat) => <CustomComponent Component={ScrollDownBar}
                                                                className="custom-scroll-down-bar" chat={chat}/>}
                renderNewMessageForm={(creds, chatId) => <CustomComponent Component={NewMessageForm}
                                                                          className="custom-new-message-form"
                                                                          creds={creds} chatId={chatId}/>}
                renderChatSettings={(chatAppProps) => <CustomComponent Component={ChatSettings}
                                                                       className="custom-chat-settings" {...chatAppProps} />}
                renderChatSettingsTop={(creds, chat) => <CustomComponent Component={ChatSettingsTop}
                                                                         className="custom-chat-settings-top"
                                                                         creds={creds} chat={chat}/>}
                renderPeopleSettings={(creds, chat) => <CustomComponent Component={PeopleSettings}
                                                                        className="custom-people-settings" creds={creds}
                                                                        chat={chat}/>}
                renderPhotosSettings={(chat) => <CustomComponent Component={PhotosSettings}
                                                                 className="custom-photos-settings" chat={chat}/>}
                renderOptionsSettings={(creds, chat) => <CustomComponent Component={OptionsSettings}
                                                                         className="custom-options-settings"
                                                                         creds={creds} chat={chat}/>}
            />
        </div>
    );
}