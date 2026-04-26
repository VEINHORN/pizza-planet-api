import type { CountryConfig } from "../CountryConfig.ts";
import type { Order } from "../Order.ts";

export interface OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number; // returns final price
}
