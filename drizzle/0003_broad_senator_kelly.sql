ALTER TABLE "form"."form_field" RENAME TO "field";--> statement-breakpoint
ALTER TABLE "form"."form_field_option" RENAME TO "field_option";--> statement-breakpoint
ALTER TABLE "form"."user_field_option_response" RENAME TO "field_option_response";--> statement-breakpoint
ALTER TABLE "form"."user_field_response" RENAME TO "field_response";--> statement-breakpoint
ALTER TABLE "form"."user_response" RENAME TO "response";--> statement-breakpoint
ALTER TABLE "form"."field" DROP CONSTRAINT "form_field_form_id_form_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field_option" DROP CONSTRAINT "form_field_option_field_id_form_field_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field_option_response" DROP CONSTRAINT "user_field_option_response_response_field_id_user_field_response_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field_option_response" DROP CONSTRAINT "user_field_option_response_option_id_form_field_option_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field_response" DROP CONSTRAINT "user_field_response_response_id_user_response_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field_response" DROP CONSTRAINT "user_field_response_field_id_form_field_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."response" DROP CONSTRAINT "user_response_form_id_form_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."response" DROP CONSTRAINT "user_response_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "form"."field" ADD CONSTRAINT "field_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "form"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."field_option" ADD CONSTRAINT "field_option_field_id_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "form"."field"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."field_option_response" ADD CONSTRAINT "field_option_response_response_field_id_field_response_id_fk" FOREIGN KEY ("response_field_id") REFERENCES "form"."field_response"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."field_option_response" ADD CONSTRAINT "field_option_response_option_id_field_option_id_fk" FOREIGN KEY ("option_id") REFERENCES "form"."field_option"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."field_response" ADD CONSTRAINT "field_response_response_id_response_id_fk" FOREIGN KEY ("response_id") REFERENCES "form"."response"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."field_response" ADD CONSTRAINT "field_response_field_id_field_id_fk" FOREIGN KEY ("field_id") REFERENCES "form"."field"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."response" ADD CONSTRAINT "response_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "form"."form"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form"."response" ADD CONSTRAINT "response_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;