export type Pizza = {
  name: string;
  size: "SMALL" | "LARGE";
  quantity: number;
};

export class Order {
  constructor(
    public countryCode: string,
    public pizzas: Pizza[],
    public address: string,
    public finalPrice: number | undefined,
    private _submittedAt: string = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    public id?: string,
  ) {}

  submittedAt(): string {
    return this._submittedAt;
  }

  isPeakHours(startHour: number, endHour: number): boolean {
    const hour = parseInt(this._submittedAt.split(":")[0], 10);
    return hour >= startHour && hour <= endHour;
  }
}
