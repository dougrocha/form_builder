// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const fieldType = pgEnum("field_type", [
  "text",
  "number",
  "boolean",
  "multiselect",
  "radio",
]);

export const form = pgTable("form", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  title: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  responses: integer().default(0),
  creator: text()
    .notNull()
    .references(() => user.id),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});

export const formRelations = relations(form, ({ many }) => ({
  fields: many(formField),
}));

export const formField = pgTable("form_field", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  formId: integer()
    .notNull()
    .references(() => form.id),
  label: varchar({ length: 256 }).notNull(),
  type: fieldType(),
  isRequired: boolean().default(false).notNull(),
  isPublished: boolean().default(false).notNull(),
  createdAt: timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
});

export const formFieldRelations = relations(formField, ({ many }) => ({
  fieldOptions: many(formFieldOption),
}));

export const formFieldOption = pgTable("form_field_option", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  formFieldId: integer()
    .notNull()
    .references(() => formField.id),
  value: varchar({ length: 256 }).notNull(),
  label: varchar({ length: 256 }).notNull(),
  position: integer().notNull(),
});

export * from "./auth";
