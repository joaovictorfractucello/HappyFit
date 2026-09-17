export class DomainError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor() {
    super("EMAIL_ALREADY_IN_USE", "Este email já está em uso.");
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor() {
    super("INVALID_CREDENTIALS", "Credenciais inválidas.");
  }
}

export class UnauthorizedError extends DomainError {
  constructor() {
    super("UNAUTHORIZED", "Autenticação necessária.");
  }
}

export class WorkoutNotFoundError extends DomainError {
  constructor() {
    super("WORKOUT_NOT_FOUND", "Treino não encontrado.");
  }
}

export class InvalidExerciseError extends DomainError {
  constructor() {
    super("INVALID_EXERCISE", "Um ou mais exercícios informados não existem.");
  }
}