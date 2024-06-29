import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "./app/api/prismaClient";
import { signInSchema } from "@/lib/zod";
import { ZodError } from "zod";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/app/login",
    signOut: "/app/login", // Add this line
  },
  providers: [
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const user = await prisma.User.findUnique({
            where: {
              email: email,
            },
          });
          if (!user) {
            return null;
          }
          const passwordCorrect = await compare(password, user.hashedPassword);
          if (passwordCorrect) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
          return null;
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
            return null;
          }
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
});
