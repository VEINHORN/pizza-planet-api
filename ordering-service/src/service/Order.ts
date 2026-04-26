export type Pizza = {
  name: string;
  size: "SMALL" | "LARGE";
  quantity: number;
};

export class Order {
  public countryCode: string;
  public pizzas: Pizza[];
  public address: string;
  public finalPrice: number | undefined;
  private _submittedAt: string;
  public id?: string;

  constructor(
    countryCode: string,
    pizzas: Pizza[],
    address: string,
    finalPrice: number | undefined,
    submittedAt: string = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    id?: string,
  ) {
    this.countryCode = countryCode;
    this.pizzas = pizzas;
    this.address = address;
    this.finalPrice = finalPrice;
    this._submittedAt = submittedAt;
    this.id = id;
  }

  submittedAt(): string {
    return this._submittedAt;
  }

  isPeakHours(startHour: number, endHour: number): boolean {
    const hour = parseInt(this._submittedAt.split(":")[0], 10);
    return hour >= startHour && hour <= endHour;
  }
}
