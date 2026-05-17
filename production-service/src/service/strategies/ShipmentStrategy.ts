import type { Shipment } from "../Shipment.ts";

export interface ShipmentStrategy {
  execute(shipment: Shipment): Shipment[];
}
