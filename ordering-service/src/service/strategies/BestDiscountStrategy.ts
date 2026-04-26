import type { CountryConfig } from "../CountryConfig.ts";
import type { Order } from "../Order.ts";
import type { OrderStrategy } from "./OrderStrategy.ts";

export class BestDiscountStrategy implements OrderStrategy {
  private strategies: OrderStrategy[];
  private countryConfig: CountryConfig;

  constructor(
    strategies: OrderStrategy[],
    countryConfig: CountryConfig,
  ) {
    this.strategies = strategies;
    this.countryConfig = countryConfig;
  }

  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    return this.strategies.reduce((bestPrice, strategy) => {
      const candidatePrice = strategy.execute(
        order,
        basePrice,
        this.countryConfig,
      );
      return Math.min(bestPrice, candidatePrice);
    }, basePrice);
  }
}
