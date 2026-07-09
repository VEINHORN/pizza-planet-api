import { describe, expect, it, vi } from "vitest";
import ExpirationJob from "./ExpirationJob.ts";

describe("ExpirationJob", () => {
  it("deletes shipments older than one week", async () => {
    const repository = {
      deleteShipmentsOlderThan: vi.fn().mockResolvedValue(3),
    };
    const job = new ExpirationJob(repository);
    const referenceDate = new Date("2026-06-24T12:00:00.000Z");

    const deletedShipmentsCount = await job.run(referenceDate);

    expect(deletedShipmentsCount).toBe(3);
    expect(repository.deleteShipmentsOlderThan).toHaveBeenCalledWith(
      new Date("2026-06-17T12:00:00.000Z"),
    );
  });
});
