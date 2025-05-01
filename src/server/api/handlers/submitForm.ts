import type { z } from "zod";
import { db } from "~/server/db";
import {
  fieldOptionResponse,
  fieldResponse,
  response,
} from "~/server/db/schema";
import type { SubmitFormResponseSchema } from "../schemas/formSchemas";

type SubmitForm = z.infer<typeof SubmitFormResponseSchema>;

export async function submitForm(
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
            },
          ])
          .returning({ id: fieldResponse.id });
        for (const value of response.value) {
          await tx.insert(fieldOptionResponse).values([
            {
              responseFieldId: userFieldResponseId!.id,
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
  });
}
