export class MockbaseException {

  private message: string;
  private type: number;

  static TYPE_RECORD_EXISTS: number = 0;
  static TYPE_RECORD_NOT_FOUND: number = 1;
  static TYPE_CONFLICT: number = 2;

  constructor(type: number, message?: string) {
    this.message = message;
    this.type    = type;
  }

  public isType(type: number): boolean {
    return type == this.type;
  }
}
