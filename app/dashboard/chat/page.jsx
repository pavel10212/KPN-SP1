"use client";

import {useState, useEffect, useRef} from 'react';
import {database} from "@/lib/firebase/firebaseConfig";
import {collection, addDoc, onSnapshot, query, where, orderBy} from "firebase/firestore";
import {useSession} from "next-auth/react";
import Image from 'next/image';
import {FiSend, FiUsers} from 'react-icons/fi';

const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {data: session} = useSession();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/user");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
                setError("Failed to load user: " + error.message);
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [session]);

    useEffect(() => {
        if (!user) {
            return;
        }
        const messagesRef = collection(database, "messages");
        const teamMessagesQuery = query(
            messagesRef,
            where("teamId", "==", user.teamId),
            orderBy("timestamp", "asc")
        );

        const unsubscribe = onSnapshot(teamMessagesQuery,
            (snapshot) => {
                const fetchedMessages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMessages(fetchedMessages);
                setIsLoading(false);
                scrollToBottom();
            },
            (error) => {
                setError("Failed to load messages: " + error.message);
                setIsLoading(false);
            }
        );

        findAllTeamMembers();

        return () => unsubscribe();
    }, [user]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    const findAllTeamMembers = async () => {
        if (!user || !user.teamId) {
            return;
        }

        try {
            const response = await fetch("/api/findAllTeamMembers");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTeamMembers(data);
        } catch (error) {
            console.error("Error fetching team members:", error);
            setError("Failed to load team members: " + error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        const messageData = {
            senderId: user.id,
            senderName: user.name || user.email,
            teamId: user.teamId,
            message: newMessage,
            timestamp: new Date().toISOString()
        };

        try {
            await addDoc(collection(database, "messages"), messageData);
            setNewMessage('');
        } catch (error) {
            console.error("Error adding document: ", error);
            setError("Failed to send message: " + error.message);
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-red-500 p-4 text-center bg-white rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <div
                        className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-800 text-white p-4 hidden md:block">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <FiUsers className="mr-2"/> Team Members
                </h2>
                <ul className="space-y-2">
                    {teamMembers.map((member) => (
                        <li key={member.id}
                            className="flex items-center p-2 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
                            <Image
                                src={member.image || '/noavatar.png'}
                                alt={member.name || member.email}
                                width={32}
                                height={32}
                                className="rounded-full mr-2"
                            />
                            <span className="truncate">{member.name || member.email}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-indigo-700 text-white p-4 shadow-md">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Team Chat</h1>
                        <h2 className="text-xl font-semibold">{user?.team?.name}</h2>
                        {user && (
                            <div className="text-right flex items-center">
                                <Image
                                    src={user.image || '/noavatar.png'}
                                    alt={user.name || user.email}
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-2"
                                />
                                <div>
                                    <p className="font-semibold">{user.name || user.email}</p>
                                    <p className="text-sm opacity-75">Team: {user.teamId}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className="flex items-end max-w-xs lg:max-w-md">
                                {message.senderId !== user?.id && (
                                    <Image
                                        src={teamMembers.find(m => m.id === message.senderId)?.image || '/noavatar.png'}
                                        alt={message.senderName}
                                        width={32}
                                        height={32}
                                        className="rounded-full mr-2 mb-2"
                                    />
                                )}
                                <div
                                    className={`px-4 py-2 rounded-lg shadow ${
                                        message.senderId === user?.id
                                            ? 'bg-indigo-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none'
                                    }`}
                                >
                                    {message.senderId !== user?.id && (
                                        <p className="font-semibold text-sm mb-1">{message.senderName}</p>
                                    )}
                                    <p>{message.message}</p>
                                    <span className="text-xs opacity-50 mt-1 block">
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>

                {/* Message Input */}
                <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white rounded-full px-6 py-2 font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 flex items-center"
                            disabled={!user}
                        >
                            <FiSend className="mr-2"/> Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatApp;