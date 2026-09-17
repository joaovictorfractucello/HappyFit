import { workoutRepository } from "../repositories/workout.repository";
import { exerciseRepository } from "../repositories/exercise.repository";
import { InvalidExerciseError } from "../errors";
import type { CreateWorkoutInput } from "../schemas/workout.schema";

export const workoutService = {
  async create(userId: string, input: CreateWorkoutInput) {
    const exerciseIds = input.exercises.map((exercise) => exercise.exerciseId);
    const uniqueIds = new Set(exerciseIds);

    const found = await exerciseRepository.findManyByIds(exerciseIds);
    if (found.length !== uniqueIds.size) {
      throw new InvalidExerciseError();
    }

    const exercisesData = input.exercises.map((exercise, index) => ({
      exerciseId: exercise.exerciseId,
      order: index,
      sets: exercise.sets,
      reps: exercise.reps,
      load: exercise.load,
    }));

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
};

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