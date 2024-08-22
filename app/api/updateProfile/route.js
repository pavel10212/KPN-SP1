import prisma from "@/app/api/prismaClient";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage"
import {storage} from "@/lib/firebase/firebaseConfig";
import {auth} from "@/auth";
import {NextResponse} from "next/server";

export async function POST(request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            console.log("Unauthorized: No valid session");
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const userId = session.user.id;
        console.log("User ID:", userId);
        if (!userId) {
            console.log("Unauthorized: No user ID in session");
            return NextResponse.json(
                {message: "Unauthorized: Invalid user session"},
                {status: 401}
            );
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const image = formData.get("image");

        let imageUrl = session.user.image;

        if (image) {
            const storageRef = ref(storage, `profile-images/${userId}.png`);

            try {
                await uploadBytes(storageRef, image);
                imageUrl = await getDownloadURL(storageRef);
            } catch (e) {
                console.log("Error uploading image:", e);
            }
        }
        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: {name, email, image: imageUrl},
        });
        console.log("User updated successfully:", updatedUser.id);

        return NextResponse.json(
            {
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json(
            {message: "Failed to update profile", error: error.message},
            {status: 500}
        );
    }
}