import { Order } from "../Order";
import { OrderStrategy } from "./OrderStrategy";
import { OffHoursStrategy } from "./OffHoursStrategy";
import { PeakHoursDiscountStrategy } from "./PeakHoursDiscountStrategy";
import { LargeOrderDiscountStrategy } from "./LargeOrderDiscountStrategy";
import { DefaultOrderStrategy } from "./DefaultOrderStrategy";
import { BestDiscountStrategy } from "./BestDiscountStrategy";
import COUNTRY_CONFIG from "../CountryConfig";

export class OrderStrategyFactory {
  static getStrategy(order: Order, basePrice: number): OrderStrategy {
    const strategies: OrderStrategy[] = [];

    const countryConfig = COUNTRY_CONFIG[order.countryCode];
    const submittedAt = order.submittedAt();

    if (
      this.toMinutes(submittedAt) <
        this.toMinutes(countryConfig.workingHours.start) ||
      this.toMinutes(submittedAt) >
        this.toMinutes(countryConfig.workingHours.end)
    ) {
      return new OffHoursStrategy();
    }

    if (
      order.isPeakHours(
        parseInt(countryConfig.peakHours.start.split(":")[0], 10),
        parseInt(countryConfig.peakHours.end.split(":")[0], 10),
      )
    ) {
      strategies.push(new PeakHoursDiscountStrategy());
    }

    if (basePrice > countryConfig.largeOrderThreshold) {
      strategies.push(new LargeOrderDiscountStrategy());
    }

    return strategies.length === 0
      ? new DefaultOrderStrategy()
      : strategies.length === 1
        ? strategies[0]
        : new BestDiscountStrategy(strategies, countryConfig);
  }

  static toMinutes(time: string): number {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  }
}
