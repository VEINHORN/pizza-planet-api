import { getIngredientAvailability } from "@pizza-planet/api-contracts";

export class ProductionServiceClient {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.PRODUCTION_SERVICE_URL || "http://localhost:3001") {
    this.baseUrl = baseUrl;
  }

  async checkIngredientAvailability(ingredientId: string) {
    const path = getIngredientAvailability.pathResolver({ ingredientId });
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to check ingredient availability for ${ingredientId}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response using the contract's schema
    return getIngredientAvailability.successResponseBodySchema.parse(data);
  }
}
