ALTER TABLE "form_field_option" RENAME COLUMN "form_field_id" TO "field_id";--> statement-breakpoint
ALTER TABLE "form_field_option" DROP CONSTRAINT "form_field_option_form_field_id_form_field_id_fk";
--> statement-breakpoint
ALTER TABLE "form_field" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "form_field_option" ADD CONSTRAINT "form_field_option_field_id_form_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."form_field"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "public"."form_field" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."field_type";--> statement-breakpoint
CREATE TYPE "public"."field_type" AS ENUM('text', 'textarea', 'number', 'email', 'phone', 'checkbox', 'radio');--> statement-breakpoint
ALTER TABLE "public"."form_field" ALTER COLUMN "type" SET DATA TYPE "public"."field_type" USING "type"::"public"."field_type";