import { type Ingredient, Shipment } from "../Shipment.ts";
import type { ShipmentStrategy } from "./ShipmentStrategy.ts";

export class ShipmentSplittingStrategy implements ShipmentStrategy {
  private readonly MAX_SHIPMENT_SIZE = 1000;

  execute(shipment: Shipment): Shipment[] {
    const result: Shipment[] = [];
    let currentIngredients: Ingredient[] = [];
    let currentTotal = 0;

    for (const ingredient of shipment.ingredients) {
      let remainingUnits = ingredient.units;

      while (remainingUnits > 0) {
        const spaceLeft = this.MAX_SHIPMENT_SIZE - currentTotal;
        const take = Math.min(remainingUnits, spaceLeft);

        if (take > 0) {
          currentIngredients.push({ id: ingredient.id, units: take });
          currentTotal += take;
          remainingUnits -= take;
        }

        if (currentTotal === this.MAX_SHIPMENT_SIZE) {
          result.push(
            new Shipment(
              shipment.targetWarehouse,
              currentIngredients,
              shipment.submittedAt(),
            ),
          );
          currentIngredients = [];
          currentTotal = 0;
        }
      }
    }

    if (currentIngredients.length > 0) {
      result.push(
        new Shipment(
          shipment.targetWarehouse,
          currentIngredients,
          shipment.submittedAt(),
        ),
      );
    }

    return result;
  }
}
