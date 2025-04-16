import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  form,
  formField,
  formFieldOption,
  userFieldOptionResponse,
  userFieldResponse,
  userResponse,
} from "~/server/db/schema/form";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  UpdateFormSchema,
  SubmitFormResponseSchema,
} from "../schemas/formSchemas";
import { TRPCError } from "@trpc/server";

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
  getAllFormResponses: protectedProcedure
    .input(z.object({ formId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.form.findFirst({
        where: eq(form.id, input.formId),
      });

      if (f?.creator != ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to the form",
        });
      }

      return await ctx.db.query.userResponse.findMany({
        with: {
          fieldResponses: {
            with: {
              field: true,
              options: {
                with: {
                  option: true,
                },
              },
            },
          },
        },
      });
    }),
  getFormResponse: protectedProcedure
    .input(z.object({ formId: z.number().int(), responseId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.form.findFirst({
        where: eq(form.id, input.formId),
      });

      if (!f || f.creator !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to the form",
        });
      }

      return await ctx.db.query.userResponse.findFirst({
        where: eq(userResponse.id, input.responseId),
        with: {
          fieldResponses: {
            with: {
              field: true,
              options: {
                with: {
                  option: true,
                },
              },
            },
          },
        },
      });
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
  submitFormResponse: protectedProcedure
    .input(SubmitFormResponseSchema)
    .mutation(async ({ ctx, input }) => {
      const { formId, responses } = input;
      const userId = ctx.session.user.id;

      // Validate that the form exists
      const formExists = await ctx.db.query.form.findFirst({
        where: eq(form.id, formId),
      });

      if (!formExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      // Insert responses into the database
      await ctx.db.transaction(async (tx) => {
        const [userResponseId] = await tx
          .insert(userResponse)
          .values([
            {
              formId,
              userId,
            },
          ])
          .returning({ id: userResponse.id });

        for (const response of responses) {
          if (response.type && !Array.isArray(response.value)) {
            await tx.insert(userFieldResponse).values([
              {
                responseId: userResponseId!.id,
                fieldId: response.fieldId,
                value: String(response.value),
                type: response.type,
              },
            ]);
          } else if (
            response.type === "checkbox" &&
            Array.isArray(response.value)
          ) {
            const [userFieldResponseId] = await tx
              .insert(userFieldResponse)
              .values([
                {
                  responseId: userResponseId!.id,
                  fieldId: response.fieldId,
                  value: undefined,
                  type: response.type,
                },
              ])
              .returning({ id: userFieldResponse.id });
            for (const value of response.value) {
              await tx.insert(userFieldOptionResponse).values([
                {
                  responseFieldId: userFieldResponseId!.id,
                  // TODO: Maybe check if this is even a valid id too
                  optionId: Number(value),
                },
              ]);
            }
          }
        }
      });

      return { success: true };
    }),
});
