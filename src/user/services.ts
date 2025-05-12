import { PrismaClient } from "@prisma/client";



export async function getAllUsers() {
    const prisma = new PrismaClient();
    return await prisma.user.findMany();
  }