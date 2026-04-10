import { Shipment } from "../Shipment";
import { ShipmentStrategy } from "./ShipmentStrategy";

export class DefaultShipmentStrategy implements ShipmentStrategy {
  execute(shipment: Shipment): Shipment[] {
    return [shipment];
  }
}
