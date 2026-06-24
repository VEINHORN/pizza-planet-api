import { describe, expect, it, vi } from "vitest";
import StaleOrderJob from "./StaleOrderJob.ts";

describe("StaleOrderJob", () => {
  it("marks a pending order as stale", async () => {
    const repository = {
      markOrderAsStale: vi.fn().mockResolvedValue(true),
    };
    const job = new StaleOrderJob(repository);

    const result = await job.run({ orderId: "order-1" });

    expect(result).toBe(true);
    expect(repository.markOrderAsStale).toHaveBeenCalledWith("order-1");
  });
});
