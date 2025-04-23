CREATE SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "account" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "verification" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "public"."account" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."session" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."user" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "public"."verification" SET SCHEMA "auth";
--> statement-breakpoint
ALTER TABLE "form"."form" DROP CONSTRAINT "form_creator_user_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."response" DROP CONSTRAINT "response_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."form" ADD CONSTRAINT "form_creator_user_id_fk" FOREIGN KEY ("creator") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."response" ADD CONSTRAINT "response_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;