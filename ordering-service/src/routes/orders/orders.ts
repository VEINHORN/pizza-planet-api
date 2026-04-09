import { FastifyPluginAsync } from "fastify";
import OrderService from "../../service/order.service";
import { Order, Pizza } from "../../service/Order";

const orders: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["countryCode", "pizzas", "address"],
          properties: {
            countryCode: { type: "string", enum: ["PL", "LT"] },
            pizzas: {
              type: "array",
              items: {
                type: "object",
                required: ["name", "size", "quantity"],
                properties: {
                  name: { type: "string" },
                  size: {
                    type: "string",
                    enum: ["SMALL", "LARGE"],
                  },
                  quantity: { type: "number" },
                },
              },
            },
            address: { type: "string" },
          },
        },
      },
    },
    async function (request, reply) {
      const { countryCode, pizzas, address } = request.body as Order;
      return new OrderService().placeOrder(
        new Order(countryCode, pizzas as Pizza[], address, undefined),
      );
    },
  );
};

export default orders;
