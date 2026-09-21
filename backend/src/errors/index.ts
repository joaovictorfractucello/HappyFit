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

export class SessionNotFoundError extends DomainError {
  constructor() {
    super("SESSION_NOT_FOUND", "Sessão não encontrada.");
  }
}

export class SessionInProgressError extends DomainError {
  constructor() {
    super("SESSION_IN_PROGRESS", "Você já tem uma sessão em andamento.");
  }
}

export class SessionAlreadyFinishedError extends DomainError {
  constructor() {
    super("SESSION_ALREADY_FINISHED", "Esta sessão já foi finalizada.");
  }
}

export class SessionExerciseNotFoundError extends DomainError {
  constructor() {
    super("SESSION_EXERCISE_NOT_FOUND", "Exercício não encontrado nesta sessão.");
  }
}

export class SetNotFoundError extends DomainError {
  constructor() {
    super("SET_NOT_FOUND", "Série não encontrada nesta sessão.");
  }
}