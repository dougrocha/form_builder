import { reset } from "drizzle-seed";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import * as schema from "./src/server/db/schema";

const auth_ctx = await auth.$context;
const users: schema.UserInsert[] = [
  {
    id: "1",
    name: "John Doe",
    email: "test@mail.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const password_hash = await auth_ctx.password.hash("password");

const accounts: schema.AccountInsert[] = [
  {
    id: "1",
    userId: "1",
    accountId: "1",
    providerId: "credential",
    password: password_hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    userId: "2",
    accountId: "2",
    providerId: "credential",
    password: password_hash,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const forms: schema.FormInsert[] = [
  {
    id: 1,
    title: "Favorite Food",
    description: "What is your favorite food?",
    creator: "1",
  },
  {
    id: 2,
    title: "Favorite Game",
    description: "What is your favorite game?",
    creator: "2",
  },
  {
    id: 3,
    title: "Visit Feedback",
    description: "How was your visit today?",
    creator: "2",
  },
];

const fields: schema.FieldInsert[] = [
  {
    id: 1,
    formId: 1,
    label: "Favorite Dish",
    type: "text",
    required: true,
    position: 1,
  },
  {
    id: 2,
    formId: 1,
    label: "Favorite Snack",
    type: "text",
    required: true,
    position: 2,
  },
  {
    id: 3,
    formId: 1,
    label: "Taste Preference",
    type: "radio",
    required: true,
    position: 3,
  },
  {
    id: 4,
    formId: 2,
    label: "Preferred Console",
    type: "text",
    required: true,
    position: 1,
  },
  {
    id: 5,
    formId: 2,
    label: "Favorite Character",
    type: "text",
    required: true,
    position: 2,
  },
  {
    id: 6,
    formId: 3,
    label: "Overall Experience",
    type: "textarea",
    required: true,
    position: 1,
  },
  {
    id: 7,
    formId: 3,
    label: "Would you recommend us?",
    type: "text",
    required: true,
    position: 2,
  },
];

const options: schema.FieldOptionInsert[] = [
  {
    id: 1,
    position: 1,
    fieldId: 3,
    value: "Sweet",
  },
  {
    id: 2,
    position: 2,
    fieldId: 3,
    value: "Salty",
  },
  {
    id: 3,
    position: 3,
    fieldId: 3,
    value: "Sour",
  },
  {
    id: 4,
    position: 4,
    fieldId: 3,
    value: "Savory",
    deletedAt: new Date(),
    isDeleted: true,
  },
];

const responses: schema.ResponseInsert[] = [
  {
    id: 1,
    userId: "1",
    formId: 1,
  },
];

const responseFields: schema.FieldResponseInsert[] = [
  {
    id: 1,
    responseId: 1,
    fieldId: 1,
    value: "Pizza",
  },
  {
    id: 2,
    responseId: 1,
    fieldId: 2,
    value: "Chips",
  },
  {
    id: 3,
    responseId: 1,
    fieldId: 3,
    value: undefined,
  },
];

const responseFieldOptions: schema.FieldOptionResponseInsert[] = [
  {
    // This should match up to the favorite food form
    // The response should be the radio field with value "sweet"
    id: 1,
    optionId: 1,
    responseFieldId: 3,
  },
];

async function main() {
  await reset(db, schema);

  await db.insert(schema.user).values(users);
  await db.insert(schema.account).values(accounts);

  await db.insert(schema.form).values(forms);
  await db.insert(schema.field).values(fields);
  await db.insert(schema.fieldOption).values(options);

  await db.insert(schema.response).values(responses);
  await db.insert(schema.fieldResponse).values(responseFields);
  await db.insert(schema.fieldOptionResponse).values(responseFieldOptions);
}

await main();
