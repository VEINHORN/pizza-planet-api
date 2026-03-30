import { FastifyPluginAsync } from "fastify";

const health: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", async function (request, reply) {
    return "OK";
  });
};

export default health;
