declare module "pg-boss" {
  export class PgBoss {
    constructor(connectionString: string);
    on(event: "error", listener: (error: Error) => void): void;
    start(): Promise<void>;
    stop(): Promise<void>;
    work(
      name: string,
      handler: (jobs: Array<{ id: string }>) => Promise<void>,
    ): Promise<unknown>;
    schedule(name: string, cron: string): Promise<unknown>;
  }
}
