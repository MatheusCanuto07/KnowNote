ALTER TABLE `text` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `text` ADD `idCategory` integer NOT NULL REFERENCES category(id);