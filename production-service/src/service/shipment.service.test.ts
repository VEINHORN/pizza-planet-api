import { describe, it, expect } from "vitest";
import ShipmentService from "./shipment.service";
import { Shipment } from "./Shipment";
import { OffHoursError, MinimumUnitsError } from "./errors";

describe("ShipmentService", () => {
  const service = new ShipmentService();

  describe("Strategy Selection & Rejection", () => {
    it("should throw OffHoursError if submitted before working hours", () => {
      // warehouse1: 08:00 - 22:00
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "07:59");
      expect(() => service.registerShipment(shipment)).toThrow(OffHoursError);
    });

    it("should throw OffHoursError if submitted after working hours", () => {
      // warehouse1: 08:00 - 22:00
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "22:01");
      expect(() => service.registerShipment(shipment)).toThrow(OffHoursError);
    });

    it("should throw MinimumUnitsError if total units are less than warehouse minUnits", () => {
      // warehouse1 minUnits: 10
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 5 }], "12:00");
      expect(() => service.registerShipment(shipment)).toThrow(MinimumUnitsError);
    });

    it("should use DefaultShipmentStrategy for valid shipment within limits", () => {
      // warehouse1: 10 <= units <= 100
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 50 }], "12:00");
      const result = service.registerShipment(shipment);
      expect(result).toHaveLength(1);
      expect(result[0].getTotalUnits()).toBe(50);
    });
  });

  describe("ShipmentSplittingStrategy", () => {
    it("should split shipment if total units exceed warehouse maxUnits (even if < 1000)", () => {
      // warehouse1 maxUnits: 100
      // Total units: 150
      const shipment = new Shipment("warehouse1", [{ id: "cheese", units: 150 }], "12:00");
      const result = service.registerShipment(shipment);
      
      // It splits because 150 > 100. The SplittingStrategy splits into chunks of 1000.
      // So 150 units will result in 1 shipment of 150 units because 150 <= 1000.
      // WAIT: The requirement says: "If more than maxUnits, split into multiple shipments of UP TO 1000 units".
      // This means if we have 150 units and maxUnits is 100, we trigger splitting.
      // The current SplittingStrategy implementation splits into chunks of 1000.
      // So 150 units -> [150 units]. This might be confusing if the user expected it to split by maxUnits?
      // Let's re-read the requirement: "split it into multiple shipments of up to 1000 units".
      // My implementation splits by 1000.
      expect(result).toHaveLength(1); 
      expect(result[0].getTotalUnits()).toBe(150);
    });

    it("should split shipment into chunks of exactly 1000 units", () => {
      // Total units: 2500
      const shipment = new Shipment("warehouse3", [{ id: "cheese", units: 2500 }], "12:00");
      // warehouse3 maxUnits: 500. 2500 > 500, so it triggers splitting.
      const result = service.registerShipment(shipment);

      expect(result).toHaveLength(3);
      expect(result[0].getTotalUnits()).toBe(1000);
      expect(result[1].getTotalUnits()).toBe(1000);
      expect(result[2].getTotalUnits()).toBe(500);
    });

    it("should split multiple ingredients across 1000-unit boundaries", () => {
      // Ingredient 1: 800 units
      // Ingredient 2: 500 units
      // Total: 1300 units
      const shipment = new Shipment("warehouse3", [
        { id: "cheese", units: 800 },
        { id: "tomato", units: 500 }
      ], "12:00");

      const result = service.registerShipment(shipment);

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

    it("should handle a single ingredient larger than 1000 units", () => {
        const shipment = new Shipment("warehouse3", [
          { id: "huge-ingredient", units: 2500 }
        ], "12:00");
  
        const result = service.registerShipment(shipment);
  
        expect(result).toHaveLength(3);
        expect(result[0].ingredients[0].units).toBe(1000);
        expect(result[1].ingredients[0].units).toBe(1000);
        expect(result[2].ingredients[0].units).toBe(500);
      });
  });
});
