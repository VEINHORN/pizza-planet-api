export type Ingredient = {
  id: string;
  units: number;
};

export class Shipment {
  public targetWarehouse: string;
  public ingredients: Ingredient[];
  public id?: string;
  private _submittedAt: string;

  constructor(
    targetWarehouse: string,
    ingredients: Ingredient[],
    submittedAt: string = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    id?: string,
  ) {
    this.targetWarehouse = targetWarehouse;
    this.ingredients = ingredients;
    this._submittedAt = submittedAt;
    this.id = id;
  }

  submittedAt(): string {
    return this._submittedAt;
  }

  getTotalUnits() {
    return this.ingredients.reduce((total, i) => total + i.units, 0);
  }
}
