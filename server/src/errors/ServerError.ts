export class ServerError extends Error {
  public constructor(
    name: string,
    public readonly message: string,
    public readonly code: number,
    public readonly userMessage: string = message,
  ) {
    super(message);
    this.name = name;
  }
}
