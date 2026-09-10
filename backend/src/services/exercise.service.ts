import { exerciseRepository } from "../repositories/exercise.repository";

export const exerciseService = {
  async list() {
    const exercises = await exerciseRepository.findAll();

    return exercises.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      muscleGroup: exercise.muscleGroup,
    }));
  },
};
