import type { CountryConfig } from "../CountryConfig.ts";
import type { Order } from "../Order.ts";
import type { OrderStrategy } from "./OrderStrategy.ts";
import { OffHoursError } from "../errors.ts";

export class OffHoursStrategy implements OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    throw new OffHoursError("Order cannot be submitted out of the working hours");
  }
}
