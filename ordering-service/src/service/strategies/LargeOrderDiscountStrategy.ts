import { CountryConfig } from "../CountryConfig";
import { Order } from "../Order";
import { OrderStrategy } from "./OrderStrategy";

export class LargeOrderDiscountStrategy implements OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    return basePrice - basePrice * countryConfig.discounts.largeOrder;
  }
}
