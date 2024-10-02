import {clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import prisma from "/app/api/prismaClient"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function findUserById(id) {
    return prisma.user.findFirst({
        where: {
            id
        },
    });
}
