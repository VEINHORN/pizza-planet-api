import { buildClient, sendByApiContract } from "@lokalise/backend-http-client";
import { notifyPizzasMade } from "@pizza-planet/api-contracts";

export class OrderingServiceClient {
  private client: any;

  constructor(baseUrl: string = process.env.ORDERING_SERVICE_URL || "http://localhost:3000") {
    this.client = buildClient(baseUrl);
  }

  async notifyPizzasMade(pizzas: { type: string; amount: number }[]) {
    const { result, error } = await sendByApiContract(this.client, notifyPizzasMade as any, {
      body: { pizzas },
    } as any);

    if (error) {
      throw new Error(`Failed to notify pizzas made: ${JSON.stringify(error)}`);
    }

    return result.body;
  }
}
