ALTER TABLE "form_field" RENAME COLUMN "is_required" TO "required";--> statement-breakpoint
ALTER TABLE "form_field" DROP CONSTRAINT "form_field_form_id_form_id_fk";
--> statement-breakpoint
ALTER TABLE "form_field_option" DROP CONSTRAINT "form_field_option_form_field_id_form_field_id_fk";
--> statement-breakpoint
ALTER TABLE "form" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "form_field" ADD COLUMN "description" varchar(1024);--> statement-breakpoint
ALTER TABLE "form_field" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "form_field" ADD CONSTRAINT "form_field_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field_option" ADD CONSTRAINT "form_field_option_form_field_id_form_field_id_fk" FOREIGN KEY ("form_field_id") REFERENCES "public"."form_field"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_field" DROP COLUMN "is_published";