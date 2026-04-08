import { CountryConfig } from "../CountryConfig";
import { Order } from "../Order";
import { OrderStrategy } from "./OrderStrategy";

export class PeakHoursDiscountStrategy implements OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    return basePrice - basePrice * countryConfig.discounts.peakHours;
  }
}
