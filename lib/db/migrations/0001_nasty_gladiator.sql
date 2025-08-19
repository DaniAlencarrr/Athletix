ALTER TABLE "users" ALTER COLUMN "profile_picture" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "profile_picture" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "date_of_birth" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "first_access";