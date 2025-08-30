CREATE TABLE "athlete_details" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"sport" text,
	"height" integer,
	"weight" integer,
	"injury_history" text
);
--> statement-breakpoint
CREATE TABLE "coach_details" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"experience" text,
	"hourly_rate" numeric(10, 2),
	"certifications" text
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"street" text,
	"city" text,
	"state" text,
	"zip_code" text,
	"country" text
);
--> statement-breakpoint
DROP TABLE "address" CASCADE;--> statement-breakpoint
DROP TABLE "athlete" CASCADE;--> statement-breakpoint
DROP TABLE "coach" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "birth_date" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "athlete_details" ADD CONSTRAINT "athlete_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coach_details" ADD CONSTRAINT "coach_details_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;