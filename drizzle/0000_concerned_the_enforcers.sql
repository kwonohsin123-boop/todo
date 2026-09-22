CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`notes` text,
	`planned_date` text NOT NULL,
	`mit_order` integer,
	`start_min` integer,
	`duration_min` integer DEFAULT 30 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`done_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "tasks_mit_order_check" CHECK("tasks"."mit_order" IS NULL OR "tasks"."mit_order" IN (0, 1, 2))
);
--> statement-breakpoint
CREATE INDEX `tasks_planned_date_idx` ON `tasks` (`planned_date`);--> statement-breakpoint
CREATE UNIQUE INDEX `tasks_planned_date_mit_order_unique` ON `tasks` (`planned_date`,`mit_order`);