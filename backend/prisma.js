import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.primsa || new PrismaClient();

if (process.env.NOTE_ENV !== "production"){
	globalForPrisma.prisma = prisma;
}

export default prisma;
