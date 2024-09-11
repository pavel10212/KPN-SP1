import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import prismaClient from "@/app/api/prismaClient";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function findUserByEmail(email) {
  return prismaClient.user.findFirst({
    where: {
        email,
    },
  });
}
