import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import prisma from "@/app/api/prismaClient";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      console.log("Unauthorized: No valid session");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      console.log("Unauthorized: No user ID in session");
      return NextResponse.json(
        { message: "Unauthorized: Invalid user session" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const image = formData.get("image");

    let imageUrl = session.user.image;

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${userId}-${uniqueSuffix}.${image.name
        .split(".")
        .pop()}`;

      const uploadDir = join(process.cwd(), "public", "uploads");
      const filePath = join(uploadDir, filename);

      await mkdir(dirname(filePath), { recursive: true });

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, image: imageUrl },
    });

    console.log("User updated successfully:", updatedUser.id);

    return NextResponse.json(
      {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: "Failed to update profile", error: error.message },
      { status: 500 }
    );
  }
}
