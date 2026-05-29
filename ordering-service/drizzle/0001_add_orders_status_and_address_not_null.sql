ALTER TABLE "orders" ADD COLUMN "status" text DEFAULT 'PENDING' NOT NULL;
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "address" SET NOT NULL;
