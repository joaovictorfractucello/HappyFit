import { prisma } from "../config/prisma";

type WorkoutExerciseInput = {
  exerciseId: string;
  order: number;
  sets: number;
  reps: number;
  load: number;
};

export const workoutRepository = {
  create(userId: string, name: string, exercises: WorkoutExerciseInput[]) {
    return prisma.workout.create({
      data: {
        userId,
        name,
        exercises: {
          create: exercises,
        },
      },
      include: {
        exercises: {
          orderBy: { order: "asc" },
          include: { exercise: true },
        },
      },
    });
  },

  findManyByUser(userId: string) {
    return prisma.workout.findMany({
      where: { userId },
      include: {
        _count: { select: { exercises: true } },
      },
    });
  },
};