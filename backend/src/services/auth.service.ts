import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository";
import { EmailAlreadyInUseError } from "../errors";
import type { RegisterInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyInUseError();
    }
 
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({ name, email, passwordHash });

    return { id: user.id, name: user.name, email: user.email };
  },
};

