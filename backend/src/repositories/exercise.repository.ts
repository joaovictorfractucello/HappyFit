import { prisma } from "../config/prisma";

export const exerciseRepository = {
  findAll() {
    return prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
  },
};
