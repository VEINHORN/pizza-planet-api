export type WarehouseConfig = {
  workingHours: { start: string; end: string };
  minUnits: number;
  maxUnits: number;
};

const WAREHOUSE_CONFIG: Record<string, WarehouseConfig> = {
  warehouse1: {
    workingHours: { start: "08:00", end: "22:00" },
    minUnits: 10,
    maxUnits: 100,
  },
  warehouse2: {
    workingHours: { start: "09:00", end: "18:00" },
    minUnits: 5,
    maxUnits: 50,
  },
  warehouse3: {
    workingHours: { start: "00:00", end: "23:59" },
    minUnits: 0,
    maxUnits: 500,
  },
};

export default WAREHOUSE_CONFIG;
