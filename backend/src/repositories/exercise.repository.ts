import { prisma } from "../config/prisma";

export const exerciseRepository = {
  findAll() {
    return prisma.exercise.findMany({
      orderBy: { name: "asc" },
    });
  },

  findManyByIds(ids: string[]) {
  return prisma.exercise.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });
},
};
