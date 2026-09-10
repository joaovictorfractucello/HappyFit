import "dotenv/config";
import { prisma } from "../src/config/prisma";

const exercises = [
  { name: "Supino reto com barra", muscleGroup: "Peito" },
  { name: "Supino inclinado com halteres", muscleGroup: "Peito" },
  { name: "Crucifixo com halteres", muscleGroup: "Peito" },
  { name: "Crossover na polia", muscleGroup: "Peito" },
  { name: "Puxada frontal", muscleGroup: "Costas" },
  { name: "Remada curvada com barra", muscleGroup: "Costas" },
  { name: "Remada baixa na polia", muscleGroup: "Costas" },
  { name: "Levantamento terra", muscleGroup: "Costas" },
  { name: "Desenvolvimento com halteres", muscleGroup: "Ombro" },
  { name: "Elevação lateral", muscleGroup: "Ombro" },
  { name: "Elevação frontal", muscleGroup: "Ombro" },
  { name: "Remada alta", muscleGroup: "Ombro" },
  { name: "Rosca direta com barra", muscleGroup: "Bíceps" },
  { name: "Rosca alternada com halteres", muscleGroup: "Bíceps" },
  { name: "Rosca martelo", muscleGroup: "Bíceps" },
  { name: "Tríceps na polia", muscleGroup: "Tríceps" },
  { name: "Tríceps testa", muscleGroup: "Tríceps" },
  { name: "Tríceps francês", muscleGroup: "Tríceps" },
  { name: "Agachamento livre", muscleGroup: "Perna" },
  { name: "Leg press 45°", muscleGroup: "Perna" },
  { name: "Cadeira extensora", muscleGroup: "Perna" },
  { name: "Mesa flexora", muscleGroup: "Perna" },
  { name: "Panturrilha em pé", muscleGroup: "Perna" },
  { name: "Abdominal supra", muscleGroup: "Abdômen" },
  { name: "Prancha", muscleGroup: "Abdômen" },
];

async function main() {
  const result = await prisma.exercise.createMany({
    data: exercises,
    skipDuplicates: true,
  });

  console.log(`Seed concluído: ${result.count} exercício(s) inserido(s).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
