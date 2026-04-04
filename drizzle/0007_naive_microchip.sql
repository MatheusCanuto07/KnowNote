ALTER TABLE `vocabulary` ADD `idText` integer NOT NULL REFERENCES text(id);--> statement-breakpoint
CREATE UNIQUE INDEX `vocabulary_idText_idUser_unique` ON `vocabulary` (`idText`,`idUser`);--> statement-breakpoint
ALTER TABLE `vocabulary` DROP COLUMN `word`;--> statement-breakpoint
ALTER TABLE `vocabulary` DROP COLUMN `expectedMeaning`;--> statement-breakpoint
ALTER TABLE `vocabulary` DROP COLUMN `note`;