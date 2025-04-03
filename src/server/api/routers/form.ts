import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { form } from "~/server/db/schema/form";

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
      });
    }),
  getAllForms: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(form);
  }),
});
