import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import AutoLoad from "@fastify/autoload";
import fastify from "fastify";
import type { AutoloadPluginOptions } from "@fastify/autoload";
import type {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyServerOptions,
} from "fastify";

export interface AppOptions
  extends FastifyServerOptions, Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};
const __dirname = dirname(fileURLToPath(import.meta.url));

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts,
): Promise<void> => {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
    ignorePattern: /.*\.test\.js$/,
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  // eslint-disable-next-line no-void
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
    ignorePattern: /.*\.test\.js$/,
  });
};

export const createApp = async (
  opts: AppOptions = {},
): Promise<FastifyInstance> => {
  const server = fastify(opts);

  void server.register(app, opts);
  await server.ready();

  return server;
};

export default app;
export { app, options };
