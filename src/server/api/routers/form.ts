import { TRPCError } from "@trpc/server";
import {
  and,
  eq,
  inArray,
  sql,
  type ExtractTablesWithRelations,
} from "drizzle-orm";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";
import { z } from "zod";
import type * as schema from "~/server/db/schema";
import {
  form,
  formField,
  formFieldOption,
  userFieldOptionResponse,
  userFieldResponse,
  userResponse,
} from "~/server/db/schema/form";
import {
  SubmitFormResponseSchema,
  UpdateFormSchema,
} from "../schemas/formSchemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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
            where: eq(formField.isDeleted, false),
            with: {
              options: {
                where: eq(formFieldOption.isDeleted, false),
              },
            },
          },
        },
      });
    }),
  getFormWithDeletedFields: protectedProcedure
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

      return await ctx.db.query.form.findFirst({
        where: eq(form.id, input.formId),
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
  getFormWithResponses: protectedProcedure
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

      return await ctx.db.query.form.findFirst({
        where: eq(form.id, input.formId),
        with: {
          responses: {
            with: {
              user: {
                columns: { name: true },
              },
              fieldResponses: {
                with: {
                  field: true,
                  options: {
                    with: {
                      option: {
                        columns: {
                          value: true,
                        },
                      },
                    },
                  },
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

      if (f?.creator !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized access to the form",
        });
      }

      return await ctx.db.query.userResponse.findFirst({
        where: eq(userResponse.id, input.responseId),
        with: {
          user: {
            columns: { name: true },
          },
          fieldResponses: {
            with: {
              field: true,
              options: {
                with: {
                  option: {
                    columns: {
                      value: true,
                    },
                  },
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
      const { formId, title, description, fields } = input;

      await ctx.db.transaction(async (tx) => {
        // Update the form
        await tx
          .update(form)
          .set({ title, description })
          .where(eq(form.id, formId));

        const existingFields = await tx.query.formField.findMany({
          where: and(
            eq(formField.formId, formId),
            eq(formField.isDeleted, false),
          ),
          with: { options: true },
        });

        const existingFieldMap = new Map(
          existingFields.map((field) => [field.id, field]),
        );

        // Track fields to delete, update, and insert
        const fieldsToDelete = [];
        const fieldsToUpdate = [];
        const fieldsToInsert = [];

        for (const field of fields) {
          const fieldId = Number(field.id);
          if (existingFieldMap.has(fieldId)) {
            // Field exists, mark for update
            fieldsToUpdate.push(field);
            existingFieldMap.delete(fieldId); // Remove from map
          } else {
            // New field, mark for insert
            fieldsToInsert.push(field);
          }
        }

        fieldsToDelete.push(...existingFieldMap.keys());

        // Delete the forms
        // This wont do a full deletion since I need to keep track of user responses
        await tx
          .update(formField)
          .set({
            isDeleted: true,
            deletedAt: new Date(),
          })
          .where(inArray(formField.id, fieldsToDelete));

        // Update fields that already exist
        for (const field of fieldsToUpdate) {
          await tx
            .update(formField)
            .set({
              label: field.label,
              description: field.description,
              position: field.position,
              required: field.required ?? false,
            })
            .where(eq(formField.id, Number(field.id)));

          // Update options similar to fields
          if (field.options) {
            await handleFieldOptions(tx, Number(field.id), field.options);
          }
        }

        // Insert new fields
        for (const field of fieldsToInsert) {
          const [newField] = await tx
            .insert(formField)
            .values({
              formId: formId,
              type: field.type,
              label: field.label,
              description: field.description,
              position: field.position,
              required: field.required ?? false,
            })
            .returning({ id: formField.id });

          // Insert options if they exist
          if (newField?.id && field.options?.length) {
            await tx.insert(formFieldOption).values(
              field.options.map((option) => ({
                value: option.value,
                fieldId: newField.id,
                position: option.position,
              })),
            );
          }
        }

        // Update the form title and description
        await tx
          .update(form)
          .set({ title, description })
          .where(eq(form.id, formId));
      });

      return await ctx.db.query.form.findFirst({
        where: eq(form.id, formId),
        with: {
          fields: {
            with: {
              options: true,
            },
          },
        },
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
          if (response.type === "checkbox" && Array.isArray(response.value)) {
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
          } else {
            const [userFieldResponseId] = await tx
              .insert(userFieldResponse)
              .values([
                {
                  responseId: userResponseId!.id,
                  fieldId: response.fieldId,
                  value: String(response.value),
                  type: response.type,
                },
              ])
              .returning({ id: userFieldResponse.id });

            if (response.type === "radio") {
              await tx.insert(userFieldOptionResponse).values([
                {
                  responseFieldId: userFieldResponseId!.id,
                  optionId: Number(response.value),
                },
              ]);
            }
          }
        }

        await tx
          .update(form)
          .set({
            responses: sql`${form.responses} + 1`,
          })
          .where(eq(form.id, formId));
      });

      return { success: true };
    }),
});

// ??
// It works
async function handleFieldOptions(
  tx: PgTransaction<
    PostgresJsQueryResultHKT,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  fieldId: number,
  options: Array<{ id?: number; value: string; position: number }>,
) {
  // Fetch existing options for the field
  const existingOptions = await tx.query.formFieldOption.findMany({
    where: and(
      eq(formFieldOption.fieldId, fieldId),
      eq(formFieldOption.isDeleted, false),
    ),
  });

  const existingOptionMap = new Map(
    existingOptions.map((option) => [option.id, option]),
  );

  // Track options to delete, update, and insert
  const optionsToDelete = [];
  const optionsToUpdate = [];
  const optionsToInsert = [];

  for (const option of options) {
    const optionId = Number(option.id);
    if (existingOptionMap.has(optionId)) {
      // Option exists, mark for update
      optionsToUpdate.push(option);
      existingOptionMap.delete(optionId); // Remove from map
    } else {
      // New option, mark for insert
      optionsToInsert.push(option);
    }
  }

  // Remaining options in the map are missing in the update payload, mark for delete
  optionsToDelete.push(...existingOptionMap.keys());

  // Soft delete missing options
  await tx
    .update(formFieldOption)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
    })
    .where(inArray(formFieldOption.id, optionsToDelete));

  // Update existing options
  for (const option of optionsToUpdate) {
    await tx
      .update(formFieldOption)
      .set({
        value: option.value,
        position: option.position,
      })
      .where(eq(formFieldOption.id, Number(option.id)));
  }

  // Insert new options
  for (const option of optionsToInsert) {
    await tx.insert(formFieldOption).values({
      fieldId,
      value: option.value,
      position: option.position,
    });
  }
}
