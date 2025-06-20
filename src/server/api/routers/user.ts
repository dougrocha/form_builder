import { desc, eq } from "drizzle-orm";
import { form } from "~/server/db/schema/form";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getForms: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.form.findMany({
      where: eq(form.creator, ctx.session.user.id),
      orderBy: (forms) => [desc(forms.createdAt)],
    });
  }),
});
