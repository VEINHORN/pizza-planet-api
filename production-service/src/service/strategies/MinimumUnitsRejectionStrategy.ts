import { MinimumUnitsError } from "../errors";
import { Shipment } from "../Shipment";
import { ShipmentStrategy } from "./ShipmentStrategy";

export class MinimumUnitsRejectionStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    throw new MinimumUnitsError(
      "Ingridient shipment has less than minimum amount of units of the warehouse",
    );
  }
}
