import { userRepository } from "../repositories/user.repository";
import { UnauthorizedError } from "../errors";

export const userService = {
  async getMe(userId: string) {
    const user = await userRepository.findById(userId);

    // Token válido mas usuário não existe mais (conta apagada, banco recriado).
    if (!user) {
      throw new UnauthorizedError();
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
