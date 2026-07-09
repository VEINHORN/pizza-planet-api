type OrderRepositoryLike = {
  markOrderAsStale(orderId: string): Promise<boolean>;
};

export type StaleOrderJobPayload = {
  orderId: string;
};

export default class StaleOrderJob {
  private readonly repository: OrderRepositoryLike;

  constructor(repository: OrderRepositoryLike) {
    this.repository = repository;
  }

  async run(payload: StaleOrderJobPayload): Promise<boolean> {
    return this.repository.markOrderAsStale(payload.orderId);
  }
}
