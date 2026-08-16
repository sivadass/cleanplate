export class ConvertError extends Error {
  readonly docsPath?: string;

  constructor(message: string, docsPath?: string) {
    super(docsPath ? `${message} See ${docsPath}.` : message);
    this.name = "ConvertError";
    this.docsPath = docsPath;
  }
}
