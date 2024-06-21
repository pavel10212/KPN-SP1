"use server";

import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";


export const addMember = async (formData) => {
  const { name, email, password, role } = Object.fromEntries(formData);
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        hashedPassword,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    return null;
    throw new Error("Error creating user");
  }
};
