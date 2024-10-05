import { useState } from "react";
import Image from "next/image";

const MessageItem = ({ message, user, teamMembers }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const toggleImageExpand = () => {
    setIsImageExpanded(!isImageExpanded);
  };

  return (
    <div
      className={`flex ${message.senderId === user?.id ? "justify-end" : "justify-start"
        }`}
    >
      <div className="flex items-end max-w-xs lg:max-w-md">
        {message.senderId !== user?.id && (
          <Image
            src={
              teamMembers.find((m) => m.id === message.senderId)?.image ||
              "/noavatar.png"
            }
            alt={message.senderName}
            width={32}
            height={32}
            className="rounded-full mr-2 mb-2"
          />
        )}
        <div
          className={`px-4 py-2 rounded-lg shadow ${message.senderId === user?.id
            ? "bg-indigo-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
            }`}
        >
          {message.senderId !== user?.id && (
            <p className="font-semibold text-sm mb-1">{message.senderName}</p>
          )}
          {message.imageUrl && (
            <div className="relative cursor-pointer" onClick={toggleImageExpand}>
              <Image
                src={message.imageUrl}
                alt="Uploaded image"
                width={isImageExpanded ? 400 : 200}
                height={isImageExpanded ? 400 : 200}
                className="rounded-lg mb-2 transition-all duration-300"
              />
              {isImageExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={toggleImageExpand}>
                  <Image
                    src={message.imageUrl}
                    alt="Expanded image"
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}
          {message.message && <p>{message.message}</p>}
          <span className="text-xs opacity-50 mt-1 block">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
