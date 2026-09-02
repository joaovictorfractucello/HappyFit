export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = new.target.name;
    }
}

export class EmailAlreadyInUseError extends DomainError {
  constructor() {
    super("Este email já está em uso.");
  }
}