import { z } from "zod";

const ingredientSchema = z.object({
  id: z.string(),
  units: z.number(),
});

export const shipmentSchema = z.object({
  targetWarehouse: z.string(),
  ingredients: z.array(ingredientSchema).min(1),
});
