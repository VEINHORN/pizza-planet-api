import { Shipment } from "../Shipment";

export interface ShipmentStrategy {
  execute(shipment: Shipment): Shipment[];
}
