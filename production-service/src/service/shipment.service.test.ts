import { describe, it, expect, vi } from "vitest";
import ShipmentService from "./shipment.service.ts";
import { Shipment } from "./Shipment.ts";
import { OffHoursError, MinimumUnitsError } from "./errors.ts";

describe("ShipmentService", () => {
  const repository = {
    createShipment: vi.fn().mockImplementation(async (shipment: Shipment) => {
      shipment.id = "mocked-id";
      return shipment;
    }),
  };
  const service = new ShipmentService(repository as any);

  describe("Strategy Selection & Rejection", () => {
    it("should throw OffHoursError if submitted before working hours", async () => {
      // warehouse1: 08:00 - 22:00
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "07:59");
      await expect(() => service.registerShipment(shipment)).rejects.toThrow(OffHoursError);
    });

    it("should throw OffHoursError if submitted after working hours", async () => {
      // warehouse1: 08:00 - 22:00
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "22:01");
      await expect(() => service.registerShipment(shipment)).rejects.toThrow(OffHoursError);
    });

    it("should throw MinimumUnitsError if total units are less than warehouse minUnits", async () => {
      // warehouse1 minUnits: 10
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 5 }], "12:00");
      await expect(() => service.registerShipment(shipment)).rejects.toThrow(MinimumUnitsError);
    });

    it("should use DefaultShipmentStrategy for valid shipment within limits", async () => {
      // warehouse1: 10 <= units <= 100
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "12:00");
      const result = await service.registerShipment(shipment);
      expect(result).toHaveLength(1);
      expect(result[0].getTotalUnits()).toBe(50);
      expect(result[0].id).toBe("mocked-id");
    });
  });

  describe("ShipmentSplittingStrategy", () => {
    it("should split shipment if total units exceed warehouse maxUnits (even if < 1000)", async () => {
      // warehouse1 maxUnits: 100
      // Total units: 150
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 150 }], "12:00");
      const result = await service.registerShipment(shipment);
      
      expect(result).toHaveLength(1); 
      expect(result[0].getTotalUnits()).toBe(150);
      expect(result[0].id).toBe("mocked-id");
    });

    it("should split shipment into chunks of exactly 1000 units", async () => {
      // Total units: 2500
      const shipment = new Shipment("warehouse3", [{ id: "cheese", units: 2500 }], "12:00");
      const result = await service.registerShipment(shipment);

      expect(result).toHaveLength(3);
      expect(result[0].getTotalUnits()).toBe(1000);
      expect(result[1].getTotalUnits()).toBe(1000);
      expect(result[2].getTotalUnits()).toBe(500);
      expect(result[0].id).toBe("mocked-id");
    });

    it("should split multiple ingredients across 1000-unit boundaries", async () => {
      // Ingredient 1: 800 units
      // Ingredient 2: 500 units
      // Total: 1300 units
      const shipment = new Shipment("warehouse3", [
        { id: "cheese", units: 800 },
        { id: "tomato", units: 500 }
      ], "12:00");

      const result = await service.registerShipment(shipment);

      expect(result).toHaveLength(2);
      expect(result[0].getTotalUnits()).toBe(1000);
      expect(result[0].ingredients).toEqual([
        { id: "cheese", units: 800 },
        { id: "tomato", units: 200 }
      ]);
      expect(result[1].getTotalUnits()).toBe(300);
      expect(result[1].ingredients).toEqual([
        { id: "tomato", units: 300 }
      ]);
    });

    it("should handle a single ingredient larger than 1000 units", async () => {
        const shipment = new Shipment("warehouse3", [
          { id: "huge-ingredient", units: 2500 }
        ], "12:00");
  
        const result = await service.registerShipment(shipment);
  
        expect(result).toHaveLength(3);
        expect(result[0].ingredients[0].units).toBe(1000);
        expect(result[1].ingredients[0].units).toBe(1000);
        expect(result[2].ingredients[0].units).toBe(500);
      });
  });
});
