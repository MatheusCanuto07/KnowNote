DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `category` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `text` ALTER COLUMN "updatedAt" TO "updatedAt" integer;--> statement-breakpoint
ALTER TABLE `theme` ALTER COLUMN "updatedAt" TO "updatedAt" integer;