import { OffHoursError } from "../errors";
import { Shipment } from "../Shipment";
import { ShipmentStrategy } from "./ShipmentStrategy";

export class OffHoursShipmentStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    throw new OffHoursError(
      "Shipment cannot be submitted out of the working hours",
    );
  }
}
