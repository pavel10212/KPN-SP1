"use client";

import { useState, useRef } from "react";
import { FiSend, FiImage, FiX } from "react-icons/fi";
import Image from "next/image";

const MessageInput = ({ newMessage, setNewMessage, handleSubmit, user, handleImageUpload }) => {
  const [uploadState, setUploadState] = useState({ isUploading: false, previewImage: null, imageStorageRef: null });
  const fileInputRef = useRef(null);

  const onImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadState(prev => ({ ...prev, isUploading: true }));
      try {
        const { imageUrl, storageRef } = await handleImageUpload(file);
        setUploadState({ isUploading: false, previewImage: imageUrl, imageStorageRef: storageRef });
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadState(prev => ({ ...prev, isUploading: false }));
      }
    }
  };

  const removeImage = async () => {
    const { imageStorageRef } = uploadState;
    if (imageStorageRef) {
      try {
        await deleteObject(imageStorageRef);
        console.log("Image deleted from Firebase Storage");
      } catch (error) {
        console.error("Error deleting image from Firebase Storage:", error);
      }
    }
    setUploadState({ isUploading: false, previewImage: null, imageStorageRef: null });
    fileInputRef.current.value = "";
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, uploadState.previewImage);
    setUploadState({ isUploading: false, previewImage: null, imageStorageRef: null });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white border-t border-gray-200 p-4">
      {uploadState.previewImage && (
        <div className="mb-4 relative">
          <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden shadow-md">
            <Image
              src={uploadState.previewImage}
              alt="Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center mt-2 text-sm text-gray-600">Image ready to send</p>
        </div>
      )}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          ref={fileInputRef}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="bg-gray-200 text-gray-600 rounded-full p-2 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
          disabled={uploadState.isUploading}
        >
          <FiImage className="w-5 h-5" />
        </button>
        <button
          type="submit"
          className="bg-indigo-500 text-white rounded-full px-4 py-2 font-medium hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200 flex items-center text-sm"
          disabled={!user || uploadState.isUploading || (!newMessage && !uploadState.previewImage)}
        >
          <FiSend className="mr-2" /> Send
        </button>
      </div>
    </form>
  );

};

export default MessageInput;
