import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export default fp(async (fastify) => {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "Pizza Planet Ordering API",
        description: "API for placing and managing pizza orders",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(swaggerUi, {
    routePrefix: "/documentation",
  });
});
