import fp from "fastify-plugin";
import type { FastifyBaseLogger } from "fastify";
import StaleOrderJob, { type StaleOrderJobPayload } from "../jobs/StaleOrderJob.ts";
import { OrderRepository } from "../repository/order.repository.ts";

const STALE_ORDER_JOB_NAME = "stale-order";
const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;

type StaleOrderJobs = {
  schedule(orderId: string): Promise<void>;
};

function logProcessedJob(
  logger: FastifyBaseLogger,
  orderId: string,
  markedAsStale: boolean,
): void {
  logger.info(
    { jobName: STALE_ORDER_JOB_NAME, markedAsStale, orderId },
    "Processed stale order job",
  );
}

export default fp(async (fastify) => {
  const noopScheduler: StaleOrderJobs = {
    async schedule() {},
  };

  fastify.decorate("staleOrderJobs", noopScheduler);

  if (!process.env.DATABASE_URL) {
    fastify.log.warn("Skipping pg-boss startup because DATABASE_URL is not set");
    return;
  }

  const { PgBoss } = await import("pg-boss");
  const { db } = await import("../index.ts");
  const boss = new PgBoss(process.env.DATABASE_URL);
  const staleOrderJob = new StaleOrderJob(new OrderRepository(db));

  boss.on("error", (error) => {
    fastify.log.error(error, "pg-boss error");
  });

  await boss.start();
  await boss.createQueue(STALE_ORDER_JOB_NAME);
  await boss.work<StaleOrderJobPayload>(STALE_ORDER_JOB_NAME, async (jobs) => {
    for (const job of jobs) {
      const markedAsStale = await staleOrderJob.run(job.data);
      logProcessedJob(fastify.log, job.data.orderId, markedAsStale);
    }
  });

  fastify.staleOrderJobs = {
    async schedule(orderId: string): Promise<void> {
      await boss.send(
        STALE_ORDER_JOB_NAME,
        { orderId },
        { startAfter: new Date(Date.now() + TWO_HOURS_IN_MS) },
      );
    },
  };

  fastify.addHook("onClose", async () => {
    await boss.stop();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    staleOrderJobs: StaleOrderJobs;
  }
}
