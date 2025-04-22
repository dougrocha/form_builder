import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgSchema,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const formSchema = pgSchema("form");

const timestamps = {
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
};

const soft_delete = {
  isDeleted: boolean().default(false).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
};

export const fieldType = formSchema.enum("field_type", [
  "text",
  "textarea",
  "number",
  "email",
  "phone",
  "checkbox",
  "radio",
]);

export const form = formSchema.table("form", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  published: boolean().default(false).notNull(),
  creator: text()
    .notNull()
    .references(() => user.id),
  ...timestamps,

  responses: integer().default(0),
  share_id: uuid()
    .unique()
    .default(sql`gen_random_uuid()`),
});

export const formRelations = relations(form, ({ many }) => ({
  fields: many(field),
  responses: many(response),
}));

export const field = formSchema.table("field", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  formId: integer()
    .references(() => form.id, { onDelete: "cascade" })
    .notNull(),
  label: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  position: integer().notNull(),
  type: fieldType().notNull(),
  required: boolean().default(false).notNull(),
  ...timestamps,
  ...soft_delete,
});

export const fieldRelations = relations(field, ({ one, many }) => ({
  form: one(form, {
    fields: [field.formId],
    references: [form.id],
  }),
  options: many(fieldOption),
}));

export const fieldOption = formSchema.table("field_option", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  fieldId: integer()
    .references(() => field.id, { onDelete: "cascade" })
    .notNull(),
  value: varchar({ length: 256 }).notNull(),
  position: integer().notNull(),
  ...timestamps,
  ...soft_delete,
});

export const fieldOptionRelations = relations(fieldOption, ({ one }) => ({
  field: one(field, {
    fields: [fieldOption.fieldId],
    references: [field.id],
  }),
}));

export type Form = typeof form.$inferSelect;
export type FormField = typeof field.$inferSelect;
export type FormFieldOption = typeof fieldOption.$inferSelect;

export type FormInsert = typeof form.$inferInsert;
export type FormFieldInsert = typeof field.$inferInsert;
export type FormFieldOptionInsert = typeof fieldOption.$inferInsert;

export type FieldType = (typeof fieldType.enumValues)[number];

export type FieldWithOptions = FormField & {
  options: FormFieldOption[];
};
export type FormWithFields = Form & {
  fields: FieldWithOptions[];
};

// User Responses
export const response = formSchema.table("response", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  formId: integer()
    .references(() => form.id, { onDelete: "cascade" })
    .notNull(),
  userId: text()
    .notNull()
    .references(() => user.id),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const responseRelations = relations(response, ({ one, many }) => ({
  form: one(form, {
    fields: [response.formId],
    references: [form.id],
  }),
  user: one(user, {
    fields: [response.userId],
    references: [user.id],
  }),
  fieldResponses: many(fieldResponse),
}));

export const fieldResponse = formSchema.table("field_response", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responseId: integer()
    .references(() => response.id, { onDelete: "cascade" })
    .notNull(),
  fieldId: integer()
    .references(() => field.id)
    .notNull(),
  type: fieldType().notNull(),
  value: text(),
});

export const fieldResponseRelations = relations(
  fieldResponse,
  ({ one, many }) => ({
    response: one(response, {
      fields: [fieldResponse.responseId],
      references: [response.id],
    }),
    field: one(field, {
      fields: [fieldResponse.fieldId],
      references: [field.id],
    }),
    options: many(fieldOptionResponse),
  }),
);

export const fieldOptionResponse = formSchema.table("field_option_response", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responseFieldId: integer()
    .references(() => fieldResponse.id, { onDelete: "cascade" })
    .notNull(),
  optionId: integer()
    .references(() => fieldOption.id)
    .notNull(),
});

export const fieldOptionResponseRelations = relations(
  fieldOptionResponse,
  ({ one }) => ({
    responseField: one(fieldResponse, {
      fields: [fieldOptionResponse.responseFieldId],
      references: [fieldResponse.id],
    }),
    option: one(fieldOption, {
      fields: [fieldOptionResponse.optionId],
      references: [fieldOption.id],
    }),
  }),
);
