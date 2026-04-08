import COUNTRY_CONFIG from "./CountryConfig";
import { Order } from "./Order";
import { PriceCalculator } from "./PriceCalculator";
import { OrderStrategyFactory } from "./strategies/OrderStrategyFactory";

export default class OrderService {
  placeOrder(order: Order) {
    const basePrice = PriceCalculator.calculate(order);

    const strategy = OrderStrategyFactory.getStrategy(order, basePrice);
    const finalPrice = strategy.execute(
      order,
      basePrice,
      COUNTRY_CONFIG[order.countryCode],
    );

    return {
      id: crypto.randomUUID(),
      price: finalPrice,
    };
  }
}
