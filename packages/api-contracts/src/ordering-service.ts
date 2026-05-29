import { defineApiContract } from "@lokalise/api-contracts";
import { z } from "zod";

export const notifyPizzasMade = defineApiContract({
  method: "post",
  pathResolver: () => "/pizzas-made",
  requestBodySchema: z.object({
    pizzas: z.array(
      z.object({
        type: z.string().describe("The type of pizza made (e.g., Margherita, Pepperoni)"),
        amount: z.number().positive().describe("The quantity of this pizza type made"),
      }),
    ),
  }),
  responsesByStatusCode: {
    200: z.object({
      status: z.string().describe("The status of the notification"),
    }),
  },
});
