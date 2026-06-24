type ShipmentRepositoryLike = {
  deleteShipmentsOlderThan(cutoff: Date): Promise<number>;
};

const EXPIRATION_WINDOW_DAYS = 7;

export default class ExpirationJob {
  private readonly repository: ShipmentRepositoryLike;

  constructor(repository: ShipmentRepositoryLike) {
    this.repository = repository;
  }

  async run(referenceDate: Date = new Date()): Promise<number> {
    const cutoff = new Date(referenceDate);
    cutoff.setDate(cutoff.getDate() - EXPIRATION_WINDOW_DAYS);

    return this.repository.deleteShipmentsOlderThan(cutoff);
  }
}
