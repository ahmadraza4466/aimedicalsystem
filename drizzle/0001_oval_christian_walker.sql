ALTER TABLE `chat_messages` ADD `create_at` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `chats` ADD `create_at` timestamp DEFAULT (now());