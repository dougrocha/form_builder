import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./auth";

export const fieldType = pgEnum("field_type", [
  "text",
  "textarea",
  "number",
  "email",
  "phone",
  "checkbox",
  "radio",
]);

export const form = pgTable("form", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  published: boolean().default(false).notNull(),
  creator: text()
    .notNull()
    .references(() => user.id),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),

  responses: integer().default(0),
  share_id: uuid()
    .unique()
    .default(sql`gen_random_uuid()`),
});

export const formRelations = relations(form, ({ many }) => ({
  fields: many(formField),
  responses: many(userResponse),
}));

export const formField = pgTable("form_field", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  formId: integer()
    .references(() => form.id, { onDelete: "cascade" })
    .notNull(),
  label: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  position: integer().notNull(),
  type: fieldType().notNull(),
  required: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
});

export const formFieldRelations = relations(formField, ({ one, many }) => ({
  form: one(form, {
    fields: [formField.formId],
    references: [form.id],
  }),
  options: many(formFieldOption),
}));

export const formFieldOption = pgTable("form_field_option", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  fieldId: integer()
    .references(() => formField.id, { onDelete: "cascade" })
    .notNull(),
  value: varchar({ length: 256 }).notNull(),
  position: integer().notNull(),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: timestamp({ withTimezone: true }),
});

export const formFieldOptionRelations = relations(
  formFieldOption,
  ({ one }) => ({
    field: one(formField, {
      fields: [formFieldOption.fieldId],
      references: [formField.id],
    }),
  }),
);

export type Form = typeof form.$inferSelect;
export type FormField = typeof formField.$inferSelect;
export type FormFieldOption = typeof formFieldOption.$inferSelect;

export type FormInsert = typeof form.$inferInsert;
export type FormFieldInsert = typeof formField.$inferInsert;
export type FormFieldOptionInsert = typeof formFieldOption.$inferInsert;

export type FieldType = (typeof fieldType.enumValues)[number];

export type FormFieldWithOptions = FormField & {
  options: FormFieldOption[];
};
export type FormWithFields = Form & {
  fields: FormFieldWithOptions[];
};

// User Responses

export const userResponse = pgTable("user_response", {
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

export const userResponseRelations = relations(
  userResponse,
  ({ one, many }) => ({
    form: one(form, {
      fields: [userResponse.formId],
      references: [form.id],
    }),
    user: one(user, {
      fields: [userResponse.userId],
      references: [user.id],
    }),
    fieldResponses: many(userFieldResponse),
  }),
);

export const userFieldResponse = pgTable("user_field_response", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responseId: integer()
    .references(() => userResponse.id, { onDelete: "cascade" })
    .notNull(),
  fieldId: integer()
    .references(() => formField.id)
    .notNull(),
  type: fieldType().notNull(),
  value: text(),
});

export const userFieldResponseRelations = relations(
  userFieldResponse,
  ({ one, many }) => ({
    response: one(userResponse, {
      fields: [userFieldResponse.responseId],
      references: [userResponse.id],
    }),
    field: one(formField, {
      fields: [userFieldResponse.fieldId],
      references: [formField.id],
    }),
    options: many(userFieldOptionResponse),
  }),
);

export const userFieldOptionResponse = pgTable("user_field_option_response", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responseFieldId: integer()
    .references(() => userFieldResponse.id, { onDelete: "cascade" })
    .notNull(),
  optionId: integer()
    .references(() => formFieldOption.id)
    .notNull(),
});

export const userFieldOptionResponseRelations = relations(
  userFieldOptionResponse,
  ({ one }) => ({
    responseField: one(userFieldResponse, {
      fields: [userFieldOptionResponse.responseFieldId],
      references: [userFieldResponse.id],
    }),
    option: one(formFieldOption, {
      fields: [userFieldOptionResponse.optionId],
      references: [formFieldOption.id],
    }),
  }),
);
