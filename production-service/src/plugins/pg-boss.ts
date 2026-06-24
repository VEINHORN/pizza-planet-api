import fp from "fastify-plugin";
import type { FastifyBaseLogger } from "fastify";
import ExpirationJob from "../jobs/ExpirationJob.ts";
import { ShipmentRepository } from "../repository/shipment.repository.ts";

const EXPIRATION_JOB_NAME = "shipment-expiration";
const EXPIRATION_CRON = "0 0 * * *";

type PgBossInstance = {
  on(event: "error", listener: (error: Error) => void): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  work(
    name: string,
    handler: (jobs: Array<{ id: string }>) => Promise<void>,
  ): Promise<unknown>;
  schedule(name: string, cron: string): Promise<unknown>;
};

function logExpirationRun(
  logger: FastifyBaseLogger,
  deletedShipmentsCount: number,
): void {
  logger.info(
    { deletedShipmentsCount, jobName: EXPIRATION_JOB_NAME },
    "Completed expired shipment cleanup",
  );
}

export default fp(async (fastify) => {
  if (!process.env.DATABASE_URL) {
    fastify.log.warn("Skipping pg-boss startup because DATABASE_URL is not set");
    return;
  }

  const { PgBoss } = await import("pg-boss");
  const { db } = await import("../index.ts");
  const boss = new PgBoss(process.env.DATABASE_URL) as PgBossInstance;
  const expirationJob = new ExpirationJob(new ShipmentRepository(db));

  boss.on("error", (error) => {
    fastify.log.error(error, "pg-boss error");
  });

  await boss.start();
  await boss.work(EXPIRATION_JOB_NAME, async () => {
    const deletedShipmentsCount = await expirationJob.run();
    logExpirationRun(fastify.log, deletedShipmentsCount);
  });
  await boss.schedule(EXPIRATION_JOB_NAME, EXPIRATION_CRON);

  fastify.addHook("onClose", async () => {
    await boss.stop();
  });
});
