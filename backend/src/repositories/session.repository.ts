import { prisma } from "../config/prisma";

type SessionExerciseInput = {
  exerciseId: string;
  order: number;
  plannedSets: number;
  plannedReps: number;
  plannedLoad: number;
};

// Reaproveitado em create/findByIdAndUser: sempre que devolvemos uma sessão
// inteira, ela vem com os exercícios ordenados, o exercício resolvido, e as
// séries já registradas (ordenadas por setNumber).
const sessionWithExercises = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: {
      exercise: true,
      sets: { orderBy: { setNumber: "asc" as const } },
    },
  },
};

export const sessionRepository = {
  findOpenByUser(userId: string) {
    return prisma.workoutSession.findFirst({
      where: { userId, endedAt: null },
    });
  },

  create(userId: string, workoutId: string, workoutName: string, exercises: SessionExerciseInput[]) {
    return prisma.workoutSession.create({
      data: {
        userId,
        workoutId,
        workoutName,
        exercises: {
          create: exercises,
        },
      },
      include: sessionWithExercises,
    });
  },

  findByIdAndUser(id: string, userId: string) {
    return prisma.workoutSession.findFirst({
      where: { id, userId },
      include: sessionWithExercises,
    });
  },
};
