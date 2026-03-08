ALTER TABLE `category` ADD `idUser` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `category` DROP COLUMN `createdBy`;--> statement-breakpoint
ALTER TABLE `category` DROP COLUMN `updatedBy`;--> statement-breakpoint
ALTER TABLE `text` ADD `idUser` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `text` DROP COLUMN `active`;--> statement-breakpoint
ALTER TABLE `text` DROP COLUMN `createdBy`;--> statement-breakpoint
ALTER TABLE `text` DROP COLUMN `updatedBy`;--> statement-breakpoint
ALTER TABLE `theme` ADD `idUser` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `theme` ADD `createdAt` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `theme` ADD `updatedAt` integer NOT NULL;