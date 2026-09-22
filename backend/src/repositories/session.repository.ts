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

  // Confirma que o sessionExerciseId realmente pertence a esta sessão
  // (cadeia de posse) — sem isso, alguém poderia registrar série na
  // sessão de outro usuário só mandando o id certo no corpo.
  findSessionExercise(sessionExerciseId: string, sessionId: string) {
    return prisma.sessionExercise.findFirst({
      where: { id: sessionExerciseId, sessionId },
    });
  },

  countSets(sessionExerciseId: string) {
    return prisma.setLog.count({ where: { sessionExerciseId } });
  },

  createSet(sessionExerciseId: string, setNumber: number, loadDone: number, repsDone: number) {
    return prisma.setLog.create({
      data: { sessionExerciseId, setNumber, loadDone, repsDone },
    });
  },

  // Mesma ideia da findSessionExercise, um nível mais fundo: confirma que
  // o setId pertence a um SessionExercise que pertence a esta sessão.
  findSetInSession(setId: string, sessionId: string) {
    return prisma.setLog.findFirst({
      where: { id: setId, sessionExercise: { sessionId } },
    });
  },

  updateSet(setId: string, loadDone: number, repsDone: number) {
    return prisma.setLog.update({
      where: { id: setId },
      data: { loadDone, repsDone },
    });
  },

  finish(id: string, endedAt: Date, durationMinutes: number) {
    return prisma.workoutSession.update({
      where: { id },
      data: { endedAt, durationMinutes },
      include: sessionWithExercises,
    });
  },

  delete(id: string) {
    return prisma.workoutSession.delete({ where: { id } });
  },

  findManyByUser(userId: string) {
    return prisma.workoutSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
    });
  },
};
