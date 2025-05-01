import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { field, fieldOption, form, response } from "~/server/db/schema/form";
import submitForm from "../handlers/submitForm";
import updateForm from "../handlers/updateForm";
import {
  SubmitFormResponseSchema,
  UpdateFormSchema,
} from "../schemas/formSchemas";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const formRouter = createTRPCRouter({
  hasAccess: protectedProcedure
    .input(z.object({ formId: z.number().int() }))
    .query(async ({ ctx, input }) => {
      const f = await ctx.db.query.form.findFirst({
        where: eq(form.id, input.formId),
      });

      if (f?.creator != ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You do not have permission to access this form",
        });
      }

      return { success: true };
    }),
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
            where: eq(field.isDeleted, false),
            with: {
              options: {
                where: eq(fieldOption.isDeleted, false),
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
  getFormResponses: protectedProcedure
    .input(
      z.object({
        formId: z.number().int(),
        pageIndex: z.number().int().min(0),
        pageSize: z.number().int().min(5),
      }),
    )
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

      return await ctx.db.query.response.findMany({
        where: eq(response.formId, input.formId),
        offset: input.pageIndex * input.pageSize,
        limit: input.pageSize,
        with: {
          user: {
            columns: { email: true, name: true },
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

      return await ctx.db.query.response.findFirst({
        where: eq(response.id, input.responseId),
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
      const { formId } = input;

      await updateForm(input);

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
      const { formId } = input;
      const userId = ctx.session.user.id;

      // Validate that the form exists
      const formExists = await ctx.db.query.form.findFirst({
        where: eq(form.id, formId),
        with: {
          fields: true,
        },
      });

      if (!formExists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Form not found",
        });
      }

      if (formExists.fields.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Form has no fields",
        });
      }

      // Insert responses into the database
      await submitForm(userId, input);

      return { success: true };
    }),
});
