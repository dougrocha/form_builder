import { db } from "~/server/db";
import type { SubmitFormResponseSchema } from "../schemas/formSchemas";
import { sql, eq } from "drizzle-orm";
import type { z } from "zod";
import {
  form,
  fieldOptionResponse,
  fieldResponse,
  response,
} from "~/server/db/schema";

type SubmitForm = z.infer<typeof SubmitFormResponseSchema>;

export default async function submitForm(
  userId: string,
  { formId, responses }: SubmitForm,
) {
  await db.transaction(async (tx) => {
    const [userResponseId] = await tx
      .insert(response)
      .values([
        {
          formId,
          userId,
        },
      ])
      .returning({ id: response.id });

    for (const response of responses) {
      if (response.type === "checkbox" && Array.isArray(response.value)) {
        const [userFieldResponseId] = await tx
          .insert(fieldResponse)
          .values([
            {
              responseId: userResponseId!.id,
              fieldId: response.fieldId,
              value: undefined,
              type: response.type,
            },
          ])
          .returning({ id: fieldResponse.id });
        for (const value of response.value) {
          await tx.insert(fieldOptionResponse).values([
            {
              responseFieldId: userFieldResponseId!.id,
              // TODO: Maybe check if this is even a valid id too
              optionId: Number(value),
            },
          ]);
        }
      } else {
        const [userFieldResponseId] = await tx
          .insert(fieldResponse)
          .values([
            {
              responseId: userResponseId!.id,
              fieldId: response.fieldId,
              value: String(response.value),
              type: response.type,
            },
          ])
          .returning({ id: fieldResponse.id });

        if (response.type === "radio") {
          await tx.insert(fieldOptionResponse).values([
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
}
