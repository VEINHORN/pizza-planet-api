import { Shipment } from "./Shipment.ts";
import { DefaultShipmentStrategy } from "./strategies/DefaultShipmentStrategy.ts";
import { MinimumUnitsRejectionStrategy } from "./strategies/MinimumUnitsRejectionStrategy.ts";
import { OffHoursShipmentStrategy } from "./strategies/OffHoursShipmentStrategy.ts";
import { ShipmentSplittingStrategy } from "./strategies/ShipmentSplittingStrategy.ts";
import WAREHOUSE_CONFIG from "./WarehouseConfig.ts";

type ShipmentRepositoryLike = {
  createShipment(shipment: Shipment): Promise<Shipment>;
};

export default class ShipmentService {
  private readonly repository?: ShipmentRepositoryLike;

  constructor(repository?: ShipmentRepositoryLike) {
    this.repository = repository;
  }

  async registerShipment(shipment: Shipment): Promise<Shipment[]> {
    const shipmentStrategy = this.getStrategy(shipment);

    const shipments = shipmentStrategy.execute(shipment);

    const savedShipments: Shipment[] = [];
    const repository = this.repository ?? (await this.createRepository());

    for (const s of shipments) {
      savedShipments.push(await repository.createShipment(s));
    }

    return savedShipments;
  }

  private async createRepository(): Promise<ShipmentRepositoryLike> {
    const { db } = await import("../index.ts");
    const { ShipmentRepository } = await import(
      "../repository/shipment.repository.ts"
    );
    return new ShipmentRepository(db);
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
