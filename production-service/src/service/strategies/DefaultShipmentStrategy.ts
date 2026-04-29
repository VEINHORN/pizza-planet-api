import { Shipment } from "../Shipment.ts";
import type { ShipmentStrategy } from "./ShipmentStrategy.ts";

export class DefaultShipmentStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    return [shipment];
  }
}
