import { db } from "..";
import { OrderRepository } from "../repository/order.repository";
import COUNTRY_CONFIG from "./CountryConfig";
import { Order } from "./Order";
import { PriceCalculator } from "./PriceCalculator";
import { OrderStrategyFactory } from "./strategies/OrderStrategyFactory";
import { ProductionServiceClient } from "./ProductionServiceClient";

export default class OrderService {
  private productionClient: ProductionServiceClient;
  private orderRepository: OrderRepository;

  constructor(
    productionClient?: ProductionServiceClient,
    orderRepository?: OrderRepository,
  ) {
    this.productionClient = productionClient ?? new ProductionServiceClient();
    this.orderRepository = orderRepository ?? new OrderRepository(db);
  }

  async placeOrder(order: Order) {
    await this.productionClient.checkIngredientAvailability("dough");

    const basePrice = PriceCalculator.calculate(order);

    const strategy = OrderStrategyFactory.getStrategy(order, basePrice);
    const finalPrice = strategy.execute(
      order,
      basePrice,
      COUNTRY_CONFIG[order.countryCode],
    );
    order.finalPrice = finalPrice;

    const savedOrder = await this.orderRepository.save(order);

    return {
      id: savedOrder.id,
      price: savedOrder.finalPrice,
    };
  }
}
