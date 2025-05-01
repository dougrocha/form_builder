import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { form } from "~/server/db/schema";

export * from "./submitForm";
export * from "./updateForm";

export const hasAccess = async (formId: number, userId: string) => {
  const f = await db.query.form.findFirst({
    where: eq(form.id, formId),
  });

  if (f?.creator != userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You do not have permission to access this form",
    });
  }

  return { success: true };
};
