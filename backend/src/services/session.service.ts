import { sessionRepository } from "../repositories/session.repository";
import { workoutRepository } from "../repositories/workout.repository";
import {
  SessionNotFoundError,
  SessionInProgressError,
  SessionAlreadyFinishedError,
  SessionExerciseNotFoundError,
  SetNotFoundError,
  WorkoutNotFoundError,
} from "../errors";
import type { AddSetInput, UpdateSetInput } from "../schemas/session.schema";

export const sessionService = {
  async start(userId: string, workoutId: string) {
    const workout = await workoutRepository.findByIdAndUser(workoutId, userId);
    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    const openSession = await sessionRepository.findOpenByUser(userId);
    if (openSession) {
      throw new SessionInProgressError();
    }

    const exercises = workout.exercises.map((workoutExercise) => ({
      exerciseId: workoutExercise.exerciseId,
      order: workoutExercise.order,
      plannedSets: workoutExercise.sets,
      plannedReps: workoutExercise.reps,
      plannedLoad: workoutExercise.load,
    }));

    const session = await sessionRepository.create(userId, workout.id, workout.name, exercises);
    return toSessionResponse(session);
  },

  async getById(userId: string, id: string) {
    const session = await sessionRepository.findByIdAndUser(id, userId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    return toSessionResponse(session);
  },

  async addSet(userId: string, sessionId: string, input: AddSetInput) {
    const session = await sessionRepository.findByIdAndUser(sessionId, userId);
    if (!session) {
      throw new SessionNotFoundError();
    }
    if (session.endedAt) {
      throw new SessionAlreadyFinishedError();
    }

    const sessionExercise = await sessionRepository.findSessionExercise(
      input.sessionExerciseId,
      sessionId,
    );
    if (!sessionExercise) {
      throw new SessionExerciseNotFoundError();
    }

    const existingSets = await sessionRepository.countSets(input.sessionExerciseId);
    const setNumber = existingSets + 1;

    return sessionRepository.createSet(
      input.sessionExerciseId,
      setNumber,
      input.loadDone,
      input.repsDone,
    );
  },

  async updateSet(userId: string, sessionId: string, setId: string, input: UpdateSetInput) {
    const session = await sessionRepository.findByIdAndUser(sessionId, userId);
    if (!session) {
      throw new SessionNotFoundError();
    }

    // Sem checar endedAt de propósito: corrigir série de sessão finalizada
    // é permitido — é o mecanismo de correção do histórico.
    const set = await sessionRepository.findSetInSession(setId, sessionId);
    if (!set) {
      throw new SetNotFoundError();
    }

    return sessionRepository.updateSet(setId, input.loadDone, input.repsDone);
  },
};

function toSessionResponse(session: Awaited<ReturnType<typeof sessionRepository.create>>) {
  return {
    id: session.id,
    workoutId: session.workoutId,
    workoutName: session.workoutName,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    durationMinutes: session.durationMinutes,
    exercises: session.exercises.map((sessionExercise) => ({
      id: sessionExercise.id,
      order: sessionExercise.order,
      plannedSets: sessionExercise.plannedSets,
      plannedReps: sessionExercise.plannedReps,
      plannedLoad: sessionExercise.plannedLoad,
      exercise: {
        id: sessionExercise.exercise.id,
        name: sessionExercise.exercise.name,
        muscleGroup: sessionExercise.exercise.muscleGroup,
      },
      sets: sessionExercise.sets.map((set) => ({
        id: set.id,
        setNumber: set.setNumber,
        loadDone: set.loadDone,
        repsDone: set.repsDone,
      })),
    })),
  };
}
