CREATE TABLE `admins` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191),
	`token` varchar(191),
	`token_sms` int,
	`email` varchar(191) NOT NULL,
	`password` varchar(191),
	`secret` varchar(191),
	`image` varchar(191),
	`role` varchar(191),
	`info` json,
	`isDev` tinyint NOT NULL DEFAULT 0,
	`loginIp` varchar(191),
	`loginAt` datetime,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime,
	CONSTRAINT `admins_id` PRIMARY KEY(`id`),
	CONSTRAINT `admins_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`payload` json,
	`attempts` int DEFAULT 0,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`createdAt` datetime NOT NULL,
	CONSTRAINT `newsletter_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `options` (
	`key` varchar(191) NOT NULL,
	`value` longtext,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime,
	CONSTRAINT `options_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `password-resets` (
	`userId` bigint unsigned NOT NULL,
	`token` varchar(191),
	`expires` bigint unsigned
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`mobile` varchar(191),
	`email` varchar(191) NOT NULL,
	`password` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`code` varchar(191),
	`verified` boolean NOT NULL DEFAULT false,
	`country` varchar(191),
	`image` varchar(191),
	`loginIp` varchar(191),
	`loginAt` datetime,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE INDEX `tokenIdx` ON `admins` (`token`);--> statement-breakpoint
CREATE INDEX `emailIdx` ON `admins` (`email`);--> statement-breakpoint
CREATE INDEX `emailIdx` ON `newsletter` (`email`);--> statement-breakpoint
CREATE INDEX `nameIdx` ON `users` (`name`);--> statement-breakpoint
CREATE INDEX `emailIdx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `countryIdx` ON `users` (`country`);