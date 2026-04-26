import { Order } from "./Order.ts";

const PIZZA_PRICES: Record<string, number> = {
  Margherita: 10,
  Pepperoni: 20,
};

export class PriceCalculator {
  static calculate(order: Order): number {
    return order.pizzas.reduce((sum, pizza) => {
      const price = PIZZA_PRICES[pizza.name] ?? 0;
      return sum + price * pizza.quantity;
    }, 0);
  }
}
