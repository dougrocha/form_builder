import type { z } from "zod";
import type { UpdateFormSchema } from "../schemas/formSchemas";
import { db } from "~/server/db";
import { eq, and, inArray, type ExtractTablesWithRelations } from "drizzle-orm";
import { form, field, fieldOption } from "~/server/db/schema";
import type * as schema from "~/server/db/schema";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

type UpdateFormInput = z.infer<typeof UpdateFormSchema>;

export default async function updateForm({
  formId,
  title,
  description,
  fields,
}: UpdateFormInput) {
  await db.transaction(async (tx) => {
    // Update the form
    await tx
      .update(form)
      .set({ title, description })
      .where(eq(form.id, formId));

    const existingFields = await tx.query.field.findMany({
      where: and(eq(field.formId, formId), eq(field.isDeleted, false)),
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
      .update(field)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where(inArray(field.id, fieldsToDelete));

    // Update fields that already exist
    for (const field of fieldsToUpdate) {
      await tx
        .update(field)
        .set({
          label: field.label,
          description: field.description,
          position: field.position,
          required: field.required ?? false,
        })
        .where(eq(field.id, Number(field.id)));

      // Update options similar to fields
      if (field.options) {
        await handleFieldOptions(tx, Number(field.id), field.options);
      }
    }

    // Insert new fields
    for (const field of fieldsToInsert) {
      const [newField] = await tx
        .insert(field)
        .values({
          formId: formId,
          type: field.type,
          label: field.label,
          description: field.description,
          position: field.position,
          required: field.required ?? false,
        })
        .returning({ id: field.id });

      // Insert options if they exist
      if (newField?.id && field.options?.length) {
        await tx.insert(fieldOption).values(
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
}

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
  const existingOptions = await tx.query.fieldOption.findMany({
    where: and(
      eq(fieldOption.fieldId, fieldId),
      eq(fieldOption.isDeleted, false),
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
    .update(fieldOption)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
    })
    .where(inArray(fieldOption.id, optionsToDelete));

  // Update existing options
  for (const option of optionsToUpdate) {
    await tx
      .update(fieldOption)
      .set({
        value: option.value,
        position: option.position,
      })
      .where(eq(fieldOption.id, Number(option.id)));
  }

  // Insert new options
  for (const option of optionsToInsert) {
    await tx.insert(fieldOption).values({
      fieldId,
      value: option.value,
      position: option.position,
    });
  }
}
