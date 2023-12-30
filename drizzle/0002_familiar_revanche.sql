ALTER TABLE `chat_messages` ADD `updated_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `chats` ADD `updated_at` timestamp DEFAULT (now());