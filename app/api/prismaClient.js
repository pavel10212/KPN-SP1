import { PrismaClient } from "@prisma/client"

let prisma;

if (process.env.NODE_ENV === 'development') {
    console.log('Connecting to Prisma in development mode')
    prisma = new PrismaClient()
} else {
    console.log('Connecting to Prisma in production mode')
    if (!global.prisma) {
        global.prisma = new PrismaClient()
    }
    prisma = global.prisma;
}

export default prisma;