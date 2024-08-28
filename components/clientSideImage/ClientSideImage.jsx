'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { storage } from '@/lib/firebase/firebaseConfig';
import { ref, getDownloadURL } from "firebase/storage";

const ClientSideImage = ({ userId, userName }) => {
    const [imageUrl, setImageUrl] = useState('/noavatar.png');

    useEffect(() => {
        const loadImage = async () => {
            try {
                const storageRef = ref(storage, `profile-images/${userId}.png`);
                const url = await getDownloadURL(storageRef);
                setImageUrl(url);
            } catch (error) {
                console.error("Error loading image:", error);
                setImageUrl('/noavatar.png')
            }
        };

        loadImage();
    }, [userId]);

    return (
        <Image
            className="rounded-full object-cover w-20 h-20 mb-3 border-2 border-indigo-500"
            src={imageUrl}
            alt={userName}
            width={100}
            height={100}
        />
    );
};

export default ClientSideImage;