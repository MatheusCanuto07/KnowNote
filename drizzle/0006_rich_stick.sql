CREATE TABLE `vocabulary` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`word` text NOT NULL,
	`expectedMeaning` text NOT NULL,
	`note` text,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`intervalDays` integer DEFAULT 0 NOT NULL,
	`easeFactorPct` integer DEFAULT 250 NOT NULL,
	`lapses` integer DEFAULT 0 NOT NULL,
	`lastReviewedAt` integer,
	`nextReviewAt` integer,
	`active` integer DEFAULT true NOT NULL,
	`idUser` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer
);
