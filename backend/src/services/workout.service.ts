import { workoutRepository } from "../repositories/workout.repository";
import { exerciseRepository } from "../repositories/exercise.repository";
import { InvalidExerciseError, WorkoutNotFoundError } from "../errors";
import type { CreateWorkoutInput } from "../schemas/workout.schema";

export const workoutService = {
  async create(userId: string, input: CreateWorkoutInput) {
    const exercisesData = await buildExercisesData(input.exercises);
    const workout = await workoutRepository.create(userId, input.name, exercisesData);
    return toWorkoutResponse(workout);
  },

  async list(userId: string) {
    const workouts = await workoutRepository.findManyByUser(userId);

    return workouts.map((workout) => ({
      id: workout.id,
      name: workout.name,
      exerciseCount: workout._count.exercises,
    }));
  },

  async getById(userId: string, id: string) {
    const workout = await workoutRepository.findByIdAndUser(id, userId);
    if (!workout) {
      throw new WorkoutNotFoundError();
    }

    return toWorkoutResponse(workout);
  },

  async update(userId: string, id: string, input: CreateWorkoutInput) {
    const existing = await workoutRepository.findByIdAndUser(id, userId);
    if (!existing) {
      throw new WorkoutNotFoundError();
    }

    const exercisesData = await buildExercisesData(input.exercises);
    const workout = await workoutRepository.update(id, input.name, exercisesData);
    return toWorkoutResponse(workout);
  },

  async remove(userId: string, id: string) {
    const existing = await workoutRepository.findByIdAndUser(id, userId);
    if (!existing) {
      throw new WorkoutNotFoundError();
    }

    await workoutRepository.delete(id);
  },
};

// Usado por create e update: confere se os exerciseId existem e calcula
// a order de cada um pela posição no array.
async function buildExercisesData(exercises: CreateWorkoutInput["exercises"]) {
  const exerciseIds = exercises.map((exercise) => exercise.exerciseId);
  const uniqueIds = new Set(exerciseIds);

  const found = await exerciseRepository.findManyByIds(exerciseIds);
  if (found.length !== uniqueIds.size) {
    throw new InvalidExerciseError();
  }

  return exercises.map((exercise, index) => ({
    exerciseId: exercise.exerciseId,
    order: index,
    sets: exercise.sets,
    reps: exercise.reps,
    load: exercise.load,
  }));
}

function toWorkoutResponse(workout: Awaited<ReturnType<typeof workoutRepository.create>>) {
  return {
    id: workout.id,
    name: workout.name,
    exercises: workout.exercises.map((workoutExercise) => ({
      id: workoutExercise.id,
      order: workoutExercise.order,
      sets: workoutExercise.sets,
      reps: workoutExercise.reps,
      load: workoutExercise.load,
      exercise: {
        id: workoutExercise.exercise.id,
        name: workoutExercise.exercise.name,
        muscleGroup: workoutExercise.exercise.muscleGroup,
      },
    })),
  };
}
