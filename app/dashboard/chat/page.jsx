"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Header from "@/components/Chat/Header";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";
import ErrorDisplay from "@/components/Chat/ErrorDisplay";
import LoadingDisplay from "@/components/Chat/LoadingDisplay";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();

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

    return onSnapshot(
      teamMessagesQuery,
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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
    const unreadMessages = fetchedMessages.filter(
      (msg) => !msg.isRead && msg.senderId !== user.id
    );
    for (const message of unreadMessages) {
      const messageRef = doc(database, "messages", message.id);
      await updateDoc(messageRef, { isRead: true });
    }
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

  const handleSubmit = async (e, imageUrl = null) => {
    if (e) e.preventDefault();
    if ((newMessage.trim() === "" && !imageUrl) || !user) return;

    const messageData = {
      senderId: user.id,
      senderName: user.name || user.email,
      teamId: user.teamId,
      message: newMessage,
      imageUrl: imageUrl,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    try {
      await addDoc(collection(database, "messages"), messageData);
      setNewMessage("");
    } catch (error) {
      handleError("Error adding document:", error);
    }
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    return { imageUrl, storageRef };
  };

  const handleError = (message, error) => {
    console.error(message, error);
    setError(message + " " + error.message);
    setIsLoading(false);
  };

  if (error) return <ErrorDisplay error={error} />;
  if (isLoading) return <LoadingDisplay />;

  return (
    <div className="flex h-full bg-gray-100">
      <div
        className="flex-1 flex flex-col h-screen"
        style={{ maxHeight: "calc(100vh - 137px)" }}
      >
        <Header user={user} teamMembers={teamMembers} />
        <MessageList
          messages={messages}
          user={user}
          teamMembers={teamMembers}
        />
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSubmit={handleSubmit}
          handleImageUpload={handleImageUpload}
          user={user}
        />
      </div>
    </div>
  );
};

export default ChatApp;
