ALTER TABLE "form_field" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "form_field_option" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;