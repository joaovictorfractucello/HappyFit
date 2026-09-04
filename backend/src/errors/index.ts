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