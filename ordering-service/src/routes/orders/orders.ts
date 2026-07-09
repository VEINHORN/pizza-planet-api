import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import OrderService from "../../service/order.service.ts";
import { Order, type Pizza } from "../../service/Order.ts";

const orderSchema = z.object({
  countryCode: z.enum(["PL", "LT"]),
  pizzas: z.array(
    z.object({
      name: z.string(),
      size: z.enum(["SMALL", "LARGE"]),
      quantity: z.number().positive(),
    }),
  ),
  address: z.string(),
});

type OrderServiceLike = {
  placeOrder(order: Order): Promise<{ id: string; price: number }>;
};

type StaleOrderSchedulerLike = {
  schedule(orderId: string): Promise<void>;
};

export type OrdersRouteOptions = {
  orderServiceFactory?: () => OrderServiceLike;
  staleOrderScheduler?: StaleOrderSchedulerLike;
};

const orders: FastifyPluginAsync<OrdersRouteOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  const orderServiceFactory =
    opts.orderServiceFactory ?? (() => new OrderService());
  const staleOrderScheduler = opts.staleOrderScheduler ?? fastify.staleOrderJobs;

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        summary: "Place a new pizza order",
        description: "Places a new order with multiple pizzas for a specific country and address",
        body: orderSchema,
      },
    },
    async function (request, reply) {
      const { countryCode, pizzas, address } = request.body as z.infer<typeof orderSchema>;
      const result = await orderServiceFactory().placeOrder(
        new Order(countryCode, pizzas as Pizza[], address, undefined),
      );
      if (!result.id) {
        throw new Error("Saved order is missing id");
      }
      await staleOrderScheduler.schedule(result.id);
      return result;
    },
  );
};

export default orders;
