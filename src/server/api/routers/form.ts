import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { form } from "~/server/db/schema/form";
import { eq } from "drizzle-orm";

export const formRouter = createTRPCRouter({
  // TODO: Switch to privateProcedure
  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(form).values({
  //       title: input.name,
  //     });
  //   }),
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
