import { prisma } from "../config/prisma";

type WorkoutExerciseInput = {
  exerciseId: string;
  order: number;
  sets: number;
  reps: number;
  load: number;
};

const workoutWithExercises = {
  exercises: {
    orderBy: { order: "asc" as const },
    include: { exercise: true },
  },
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
      include: workoutWithExercises,
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

  findByIdAndUser(id: string, userId: string) {
    return prisma.workout.findFirst({
      where: { id, userId },
      include: workoutWithExercises,
    });
  },

  update(id: string, name: string, exercises: WorkoutExerciseInput[]) {
    return prisma.workout.update({
      where: { id },
      data: {
        name,
        exercises: {
          deleteMany: {},
          create: exercises,
        },
      },
      include: workoutWithExercises,
    });
  },

  delete(id: string) {
    return prisma.workout.delete({ where: { id } });
  },
};