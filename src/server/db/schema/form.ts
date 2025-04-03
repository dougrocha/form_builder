import { user } from "./auth";
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

export const fieldType = pgEnum("field_type", [
  "text",
  "number",
  "boolean",
  "multiselect",
  "radio",
]);

export const form = pgTable("form", {
  id: integer().primaryKey(),
  title: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  responses: integer().default(0),
  published: boolean().default(false).notNull(),
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
    .references(() => form.id, { onDelete: "cascade" })
    .notNull(),
  label: varchar({ length: 256 }).notNull(),
  description: varchar({ length: 1024 }),
  position: integer().notNull(),
  type: fieldType(),
  required: boolean().default(false).notNull(),
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
    .references(() => formField.id, { onDelete: "cascade" })
    .notNull(),
  value: varchar({ length: 256 }).notNull(),
  label: varchar({ length: 256 }).notNull(),
  position: integer().notNull(),
});
