import { OffHoursError } from "../errors.ts";
import { Shipment } from "../Shipment.ts";
import type { ShipmentStrategy } from "./ShipmentStrategy.ts";

export class OffHoursShipmentStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    throw new OffHoursError(
      "Shipment cannot be submitted out of the working hours",
    );
  }
}
