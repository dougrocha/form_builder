CREATE SCHEMA "form";
--> statement-breakpoint
ALTER TYPE "public"."field_type" SET SCHEMA "form";--> statement-breakpoint
ALTER TABLE "public"."form" SET SCHEMA "form";
--> statement-breakpoint
ALTER TABLE "public"."form_field" SET SCHEMA "form";
--> statement-breakpoint
ALTER TABLE "public"."form_field_option" SET SCHEMA "form";
--> statement-breakpoint
ALTER TABLE "public"."user_field_option_response" SET SCHEMA "form";
--> statement-breakpoint
ALTER TABLE "public"."user_field_response" SET SCHEMA "form";
--> statement-breakpoint
ALTER TABLE "public"."user_response" SET SCHEMA "form";
