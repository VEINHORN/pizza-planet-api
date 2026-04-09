import { db } from "..";
import { OrderRepository } from "../repository/order.repository";
import COUNTRY_CONFIG from "./CountryConfig";
import { Order } from "./Order";
import { PriceCalculator } from "./PriceCalculator";
import { OrderStrategyFactory } from "./strategies/OrderStrategyFactory";

export default class OrderService {
  async placeOrder(order: Order) {
    const basePrice = PriceCalculator.calculate(order);

    const strategy = OrderStrategyFactory.getStrategy(order, basePrice);
    const finalPrice = strategy.execute(
      order,
      basePrice,
      COUNTRY_CONFIG[order.countryCode],
    );
    order.finalPrice = finalPrice;

    const savedOrder = await new OrderRepository(db).save(order);

    return {
      id: savedOrder.id,
      price: savedOrder.finalPrice,
    };
  }
}
