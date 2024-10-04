"use client";

import { useState, useEffect, useRef } from 'react';
import { database } from "@/lib/firebase/firebaseConfig";
import { collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { FiSend, FiUsers } from 'react-icons/fi';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, [session]);

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToMessages();
      findAllTeamMembers();
      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      handleError("Error fetching user:", error);
    }
  };

  const subscribeToMessages = () => {
    const messagesRef = collection(database, "messages");
    const teamMessagesQuery = query(
      messagesRef,
      where("teamId", "==", user.teamId),
      orderBy("timestamp", "asc")
    );

    return onSnapshot(teamMessagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(fetchedMessages);
        console.log("Messages loaded:", fetchedMessages);
        setIsLoading(false);
        markAllMessagesAsRead(fetchedMessages);
      },
      (error) => handleError("Failed to load messages:", error)
    );
  };

  const markAllMessagesAsRead = async (fetchedMessages) => {
    const unreadMessages = fetchedMessages.filter(msg => !msg.isRead && msg.senderId !== user.id);
    for (const message of unreadMessages) {
      const messageRef = doc(database, 'messages', message.id);
      await updateDoc(messageRef, { isRead: true });
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const findAllTeamMembers = async () => {
    if (!user || !user.teamId) return;

    try {
      const response = await fetch("/api/findAllTeamMembers");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTeamMembers(data);
    } catch (error) {
      handleError("Error fetching team members:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !user) return;

    const messageData = {
      senderId: user.id,
      senderName: user.name || user.email,
      teamId: user.teamId,
      message: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    try {
      await addDoc(collection(database, "messages"), messageData);
      setNewMessage('');
    } catch (error) {
      handleError("Error adding document:", error);
    }
  };

  const handleError = (message, error) => {
    console.error(message, error);
    setError(message + " " + error.message);
    setIsLoading(false);
  };

  if (error) return <ErrorDisplay error={error} />;
  if (isLoading) return <LoadingDisplay />;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar teamMembers={teamMembers} />
      <MainChatArea
        user={user}
        messages={messages}
        teamMembers={teamMembers}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSubmit={handleSubmit}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

const Sidebar = ({ teamMembers }) => (
  <div className="w-64 bg-indigo-800 text-white p-4 hidden md:block overflow-y-auto">
    <h2 className="text-xl font-bold mb-4 flex items-center">
      <FiUsers className="mr-2" /> Team Members
    </h2>
    <ul className="space-y-2">
      {teamMembers.map((member) => (
        <TeamMemberItem key={member.id} member={member} />
      ))}
    </ul>
  </div>
);

const TeamMemberItem = ({ member }) => (
  <li className="flex items-center p-2 hover:bg-indigo-700 rounded-lg transition-colors duration-200">
    <Image
      src={member.image || '/noavatar.png'}
      alt={member.name || member.email}
      width={32}
      height={32}
      className="rounded-full mr-2"
    />
    <div className="flex flex-col">
      <span className="font-semibold">{member.name}</span>
      <span className="text-sm">{member.email}</span>
    </div>
  </li>
);

const MainChatArea = ({ user, messages, teamMembers, newMessage, setNewMessage, handleSubmit, messagesEndRef }) => (
  <div className="flex-1 flex flex-col h-screen">
    <Header user={user} />
    <MessageList messages={messages} user={user} teamMembers={teamMembers} messagesEndRef={messagesEndRef} />
    <MessageInput newMessage={newMessage} setNewMessage={setNewMessage} handleSubmit={handleSubmit} user={user} />
  </div>
);

const Header = ({ user }) => (
  <header className="bg-indigo-700 text-white p-4 shadow-md">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Team Chat</h1>
      <h2 className="text-xl font-semibold">{user?.team?.name}</h2>
      {user && <UserInfo user={user} />}
    </div>
  </header>
);

const UserInfo = ({ user }) => (
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
);

const MessageList = ({ messages, user, teamMembers, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
    style={{ height: 'calc(100vh - 144px)' }}
  >
    {messages.map((message) => (
      <MessageItem key={message.id} message={message} user={user} teamMembers={teamMembers} />
    ))}
    <div ref={messagesEndRef} />
  </div>
);

const MessageItem = ({ message, user, teamMembers }) => (
  <div className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
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
        className={`px-4 py-2 rounded-lg shadow ${message.senderId === user?.id
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
);

const MessageInput = ({ newMessage, setNewMessage, handleSubmit, user }) => (
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
        <FiSend className="mr-2" /> Send
      </button>
    </div>
  </form>
);

const ErrorDisplay = ({ error }) => (
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

const LoadingDisplay = () => (
  <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <div
        className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
      <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
    </div>
  </div>
);

export default ChatApp;
