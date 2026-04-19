export class OffHoursError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "OffHoursError";
    this.statusCode = 400;
  }
}

export class MinimumUnitsError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "MinimumUnitsError";
    this.statusCode = 400;
  }
}
