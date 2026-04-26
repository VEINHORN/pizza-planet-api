import { buildContract } from "@lokalise/api-contracts";
import { z } from "zod";

const requestPathParamsSchema = z.object({
  ingredientId: z.string().describe("The unique identifier of the ingredient"),
});

export const getIngredientAvailability = buildContract({
  method: "get",
  pathResolver: (params: z.infer<typeof requestPathParamsSchema>) =>
    `/shipments/ingredients/${params.ingredientId}/availability`,
  requestPathParamsSchema,
  successResponseBodySchema: z.object({
    amount: z
      .number()
      .describe(
        "The amount of ingredient currently available in the warehouse",
      ),
    unit: z
      .string()
      .describe("The unit of measurement (e.g., kg, liters, units)"),
  }),
});
