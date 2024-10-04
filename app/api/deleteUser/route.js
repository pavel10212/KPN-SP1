import { NextResponse } from "next/server";
import prisma from "@/app/api/prismaClient";
import { doc, deleteDoc } from "firebase/firestore";
import { database } from "@/lib/firebase/firebaseConfig";

export async function POST(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.User.delete({ where: { id } });
  await deleteDoc(doc(database, "users", id));

  return NextResponse.json({ message: "User deleted" });
}
