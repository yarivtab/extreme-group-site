CREATE TABLE `adam_jobs` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`profession` text,
	`subprofession` text,
	`location` text,
	`areas_json` text DEFAULT '[]' NOT NULL,
	`job_scope` text,
	`description_text` text,
	`requirements_text` text,
	`published_at` text,
	`closes_at` text,
	`source_updated_at` text,
	`referral_reward` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`synced_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `adam_jobs_slug_unique` ON `adam_jobs` (`slug`);--> statement-breakpoint
CREATE TABLE `adam_sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
