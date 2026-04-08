import { CountryConfig } from "../CountryConfig";
import { Order } from "../Order";
import { OrderStrategy } from "./OrderStrategy";
import { OffHoursError } from "../errors";

export class OffHoursStrategy implements OrderStrategy {
  execute(
    order: Order,
    basePrice: number,
    countryConfig: CountryConfig,
  ): number {
    throw new OffHoursError("Order cannot be submitted out of the working hours");
  }
}
