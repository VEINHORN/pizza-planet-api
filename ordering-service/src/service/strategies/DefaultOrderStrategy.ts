import type { CountryConfig } from "../CountryConfig.ts";
import type { Order } from "../Order.ts";
import type { OrderStrategy } from "./OrderStrategy.ts";

export class DefaultOrderStrategy implements OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    return basePrice;
  }
}
