import { CountryConfig } from "../CountryConfig";
import { Order } from "../Order";

export interface OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number; // returns final price
}
