export type Ingredient = {
  id: string;
  units: number;
};

export class Shipment {
  constructor(
    public targetWarehouse: string,
    public ingredients: Ingredient[],
    private _submittedAt: string = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    public id?: string,
  ) {}

  submittedAt(): string {
    return this._submittedAt;
  }

  getTotalUnits() {
    return this.ingredients.reduce((total, i) => total + i.units, 0);
  }
}
