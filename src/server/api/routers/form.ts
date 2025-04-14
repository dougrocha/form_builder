import { eq } from "drizzle-orm";
import { z } from "zod";
import { form, formField, formFieldOption } from "~/server/db/schema/form";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const FormFieldOptionSchema = z.object({
  id: z.any(),
  value: z.string(),
  position: z.number(),
});

const FormFieldSchema = z.object({
  id: z.any(),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "email",
    "phone",
    "checkbox",
    "radio",
  ]),
  label: z.string(),
  description: z.string().nullish(),
  position: z.number(),
  required: z.boolean().optional(),
  options: z.array(FormFieldOptionSchema).optional(),
});

const UpdateFormSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().nullish(),
  fields: z.array(FormFieldSchema),
});

export const formRouter = createTRPCRouter({
  createForm: protectedProcedure
    .input(
      z.object({ title: z.string().min(1), description: z.string().min(1) }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await ctx.db
        .insert(form)
        .values({
          title: input.title,
          description: input.description,
          creator: ctx.session.user.id,
        })
        .returning({ id: form.id });

      return result;
    }),
  getForm: publicProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.form.findFirst({
        where: eq(form.id, input.id),
        with: {
          fields: {
            with: {
              options: true,
            },
          },
        },
      });
    }),
  getAllForms: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(form);
  }),
  // mutations
  updateForm: protectedProcedure
    .input(UpdateFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, title, description, fields } = input;

      // Start a transaction to ensure data consistency
      return await ctx.db.transaction(async (tx) => {
        // Update the form
        await tx
          .update(form)
          .set({ title, description })
          .where(eq(form.id, id));

        // Delete existing fields and options to replace with new ones
        await tx.delete(formFieldOption).where(eq(formFieldOption.fieldId, id));
        await tx.delete(formField).where(eq(formField.formId, id));

        // Insert new fields
        for (const field of fields) {
          const [newField] = await tx
            .insert(formField)
            .values({
              formId: id,
              type: field.type,
              label: field.label,
              description: field.description,
              position: field.position,
              required: field.required ?? false,
            })
            .returning({ id: formField.id });

          const formFieldId = newField?.id;

          // Insert options if they exist
          if (formFieldId && field.options?.length) {
            await tx.insert(formFieldOption).values(
              field.options.map((option) => ({
                value: option.value,
                fieldId: formFieldId,
                position: option.position,
              })),
            );
          }
        }

        return { success: true };
      });
    }),
});
