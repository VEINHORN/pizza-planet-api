import { z } from "zod";

const shipmentItemSchema = z.object({
  ingredientName: z.string().min(1).max(100),
  quantity: z.number().positive().int(),
  unit: z.enum(["kg", "g", "L", "ml", "pieces", "bags", "boxes"]),
  expiryDate: z.string().date().optional(),
  unitPrice: z.number().positive().optional(),
});

export const ingridientShipmentSchema = z.object({
  supplier: z.string().min(1).optional(),
  receivedAt: z.string().datetime().optional(),
  lotNumber: z.string().optional(),
  items: z.array(shipmentItemSchema).min(1),
});
