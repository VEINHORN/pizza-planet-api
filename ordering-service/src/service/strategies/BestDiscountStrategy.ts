import { CountryConfig } from "../CountryConfig";
import { Order } from "../Order";
import { OrderStrategy } from "./OrderStrategy";

export class BestDiscountStrategy implements OrderStrategy {
  constructor(
    private strategies: OrderStrategy[],
    private countryConfig: CountryConfig,
  ) {}

  execute(order: Order, basePrice: number): number {
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
