import { PrismaClient } from "@prisma/client";



export async function getAllProducts() {
    const prisma = new PrismaClient();
  return prisma.product.findMany();
}

export async function getProductById(id: string) {
    const prisma = new PrismaClient();
  return prisma.product.findUnique({ where: { id } });
}

export async function createProduct(data: { name: string; price: number; quantity: number, userId: string }) {
    const prisma = new PrismaClient();
  return prisma.product.create({ data });
}

export async function updateProduct(id: string, data: Partial<{ name: string; price: number; quantity: number }>) {
    const prisma = new PrismaClient();
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
    const prisma = new PrismaClient();
  return prisma.product.delete({ where: { id } });
}