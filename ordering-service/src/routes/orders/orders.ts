import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import OrderService from "../../service/order.service";
import { Order, Pizza } from "../../service/Order";

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

const orders: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
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
      const { countryCode, pizzas, address } = request.body;
      return new OrderService().placeOrder(
        new Order(countryCode, pizzas as Pizza[], address, undefined),
      );
    },
  );
};

export default orders;
