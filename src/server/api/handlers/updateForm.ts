import { and, eq, inArray } from "drizzle-orm";
import type { z } from "zod";
import { db, type TransactionType } from "~/server/db";
import {
  fieldOption as fieldOptionSchema,
  field as fieldSchema,
  form as formSchema,
} from "~/server/db/schema";
import type { UpdateFormSchema } from "../schemas/formSchemas";

type UpdateFormInput = z.infer<typeof UpdateFormSchema>;

export async function updateForm({
  formId,
  title,
  description,
  fields,
}: UpdateFormInput) {
  await db.transaction(async (tx) => {
    // Update the form
    await tx
      .update(formSchema)
      .set({ title, description })
      .where(eq(formSchema.id, formId));

    const existingFields = await tx.query.field.findMany({
      where: and(
        eq(fieldSchema.formId, formId),
        eq(fieldSchema.isDeleted, false),
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
      .update(fieldSchema)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where(inArray(fieldSchema.id, fieldsToDelete));

    // Update fields that already exist
    for (const field of fieldsToUpdate) {
      await tx
        .update(fieldSchema)
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
        .insert(fieldSchema)
        .values({
          formId: formId,
          type: field.type,
          label: field.label,
          description: field.description,
          position: field.position,
          required: field.required ?? false,
        })
        .returning({ id: fieldSchema.id });

      // Insert options if they exist
      if (newField?.id && field.options?.length) {
        await tx.insert(fieldOptionSchema).values(
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
      .update(formSchema)
      .set({ title, description })
      .where(eq(formSchema.id, formId));
  });
}

async function handleFieldOptions(
  tx: TransactionType,
  fieldId: number,
  options: Array<{ id?: number; value: string; position: number }>,
) {
  // Fetch existing options for the field
  const existingOptions = await tx.query.fieldOption.findMany({
    where: and(
      eq(fieldOptionSchema.fieldId, fieldId),
      eq(fieldOptionSchema.isDeleted, false),
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
    .update(fieldOptionSchema)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
    })
    .where(inArray(fieldOptionSchema.id, optionsToDelete));

  // Update existing options
  for (const option of optionsToUpdate) {
    await tx
      .update(fieldOptionSchema)
      .set({
        value: option.value,
        position: option.position,
      })
      .where(eq(fieldOptionSchema.id, Number(option.id)));
  }

  // Insert new options
  for (const option of optionsToInsert) {
    await tx.insert(fieldOptionSchema).values({
      fieldId,
      value: option.value,
      position: option.position,
    });
  }
}
