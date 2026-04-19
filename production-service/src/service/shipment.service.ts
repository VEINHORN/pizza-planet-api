import { db } from "..";
import { ShipmentRepository } from "../repository/shipment.repository";
import { Shipment } from "./Shipment";
import { DefaultShipmentStrategy } from "./strategies/DefaultShipmentStrategy";
import { MinimumUnitsRejectionStrategy } from "./strategies/MinimumUnitsRejectionStrategy";
import { OffHoursShipmentStrategy } from "./strategies/OffHoursShipmentStrategy";
import { ShipmentSplittingStrategy } from "./strategies/ShipmentSplittingStrategy";
import WAREHOUSE_CONFIG from "./WarehouseConfig";

export default class ShipmentService {
  async registerShipment(shipment: Shipment): Promise<Shipment[]> {
    const shipmentStrategy = this.getStrategy(shipment);

    const shipments = shipmentStrategy.execute(shipment);

    const savedShipments: Shipment[] = [];
    const repository = new ShipmentRepository(db);

    for (const s of shipments) {
      savedShipments.push(await repository.createShipment(s));
    }

    return savedShipments;
  }

  getStrategy(shipment: Shipment) {
    const warehouseConfig = WAREHOUSE_CONFIG[shipment.targetWarehouse];
    const submittedAt = shipment.submittedAt();

    if (
      this.toMinutes(submittedAt) <
        this.toMinutes(warehouseConfig.workingHours.start) ||
      this.toMinutes(submittedAt) >
        this.toMinutes(warehouseConfig.workingHours.end)
    ) {
      return new OffHoursShipmentStrategy();
    } else if (shipment.getTotalUnits() < warehouseConfig.minUnits) {
      return new MinimumUnitsRejectionStrategy();
    } else if (shipment.getTotalUnits() > warehouseConfig.maxUnits) {
      return new ShipmentSplittingStrategy();
    }

    return new DefaultShipmentStrategy();
  }

  toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }
}
