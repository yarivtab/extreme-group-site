CREATE TABLE `adam_job_publications` (
	`job_id` integer PRIMARY KEY NOT NULL,
	`source_fingerprint` text NOT NULL,
	`public_title` text NOT NULL,
	`public_summary` text DEFAULT '' NOT NULL,
	`public_description` text DEFAULT '' NOT NULL,
	`public_requirements` text DEFAULT '' NOT NULL,
	`editorial_status` text DEFAULT 'auto_published' NOT NULL,
	`confidence` integer DEFAULT 100 NOT NULL,
	`flags_json` text DEFAULT '[]' NOT NULL,
	`engine_version` text NOT NULL,
	`generated_at` text NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `adam_jobs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `adam_job_publications_status_idx` ON `adam_job_publications` (`editorial_status`,`confidence`);