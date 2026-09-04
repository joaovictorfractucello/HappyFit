import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository";
import { EmailAlreadyInUseError, InvalidCredentialsError } from "../errors";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema";

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definida no ambiente (.env)");
}

const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

// Hash sem correspondência real, usado só pra equalizar o tempo de resposta
// quando o email não existe (ver DECISIONS.md — enumeração de usuários).
const DUMMY_HASH = bcrypt.hashSync("dummy-password-para-timing", SALT_ROUNDS);

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

  async login({ email, password }: LoginInput) {
    const user = await userRepository.findByEmail(email);

    const passwordHash = user?.passwordHash ?? DUMMY_HASH;
    const passwordMatches = await bcrypt.compare(password, passwordHash);

    if (!user || !passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  },
};
