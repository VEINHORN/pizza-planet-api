export class OffHoursError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "OffHoursError";
    this.statusCode = 400;
  }
}
