export type CountryConfig = {
  workingHours: { start: string; end: string };
  peakHours: { start: string; end: string };
  largeOrderThreshold: number;
  discounts: {
    // in %
    offHours: number;
    peakHours: number;
    largeOrder: number;
  };
};

const COUNTRY_CONFIG: Record<string, CountryConfig> = {
  PL: {
    workingHours: { start: "00:00", end: "23:59" },
    peakHours: { start: "12:00", end: "14:00" },
    largeOrderThreshold: 100,
    discounts: {
      offHours: 0.2,
      peakHours: 0.1,
      largeOrder: 0.15,
    },
  },
  LT: {
    workingHours: { start: "09:00", end: "18:00" },
    peakHours: { start: "13:00", end: "15:00" },
    largeOrderThreshold: 80,
    discounts: {
      offHours: 0.25,
      peakHours: 0.05,
      largeOrder: 0.2,
    },
  },
};

export default COUNTRY_CONFIG;
