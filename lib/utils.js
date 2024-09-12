import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import prisma from "/app/api/prismaClient"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function findUserByEmail(email) {
    return prisma.user.findFirst({
        where: {
            email,
        },
    });
}
