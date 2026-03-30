import { FastifyPluginAsync } from "fastify";

const orders: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["orderId", "pizzas", "userId", "address"],
          properties: {
            orderId: { type: "string" },
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
                },
              },
            },
            userId: { type: "number" },
            address: { type: "string" },
          },
        },
      },
    },
    async function (request, reply) {
      console.log(request.body);

      return request.body;
    },
  );
};

export default orders;
