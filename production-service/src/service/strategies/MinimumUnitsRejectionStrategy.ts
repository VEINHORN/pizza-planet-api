import { MinimumUnitsError } from "../errors.ts";
import { Shipment } from "../Shipment.ts";
import type { ShipmentStrategy } from "./ShipmentStrategy.ts";

export class MinimumUnitsRejectionStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    throw new MinimumUnitsError(
      "Ingridient shipment has less than minimum amount of units of the warehouse",
    );
  }
}
