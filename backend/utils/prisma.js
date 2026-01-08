import { PrismaClient } from "@prisma/client";
import { pagination } from "prisma-extension-pagination";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient().$extends(pagination());

if (process.env.NODE_ENV !== "production"){ 
  globalThis.prisma = prisma;
}

export default prisma;
