import { buildClient, sendByApiContract } from "@lokalise/backend-http-client";
import { getIngredientAvailability } from "@pizza-planet/api-contracts";

export class ProductionServiceClient {
  private client: any;

  constructor(baseUrl: string = process.env.PRODUCTION_SERVICE_URL || "http://localhost:3001") {
    this.client = buildClient(baseUrl);
  }

  async checkIngredientAvailability(ingredientId: string) {
    const { result, error } = await sendByApiContract(this.client, getIngredientAvailability as any, {
      pathParams: { ingredientId },
    } as any);

    if (error) {
      throw new Error(`Failed to check ingredient availability for ${ingredientId}: ${JSON.stringify(error)}`);
    }

    return result.body;
  }
}
