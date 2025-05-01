import { reset } from "drizzle-seed";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import * as schema from "./src/server/db/schema";

const auth_ctx = await auth.$context;

// prettier-ignore
const users: schema.UserInsert[] = [
  { id: "1", name: "John Doe", email: "test@mail.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "3", name: "Alice Johnson", email: "alice.johnson@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "4", name: "Bob Brown", email: "bob.brown@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "5", name: "Charlie Davis", email: "charlie.davis@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "6", name: "Diana Evans", email: "diana.evans@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
  { id: "7", name: "Ethan Foster", email: "ethan.foster@example.com", emailVerified: false, createdAt: new Date(), updatedAt: new Date(), },
];

const password_hash = await auth_ctx.password.hash("password");

// prettier-ignore
const accounts: schema.AccountInsert[] = [
  { id: "1", userId: "1", accountId: "1", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "2", userId: "2", accountId: "2", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "3", userId: "3", accountId: "3", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "4", userId: "4", accountId: "4", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "5", userId: "5", accountId: "5", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "6", userId: "6", accountId: "6", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
  { id: "7", userId: "7", accountId: "7", providerId: "credential", password: password_hash, createdAt: new Date(), updatedAt: new Date(), },
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
    creator: "5",
  },
  {
    id: 4,
    title: "User Feedback",
    description: "Please provide your feedback about our service.",
    creator: "4",
  },
  {
    id: 5,
    title: "Favorite Movie",
    description: "What is your favorite movie and why?",
    creator: "6",
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
  {
    id: 8,
    formId: 4,
    label: "Feedback",
    type: "textarea",
    required: true,
    position: 1,
  },
  {
    id: 9,
    formId: 5,
    label: "Favorite Movie",
    type: "text",
    required: true,
    position: 1,
  },
  {
    id: 10,
    formId: 5,
    label: "Reason",
    type: "textarea",
    required: true,
    position: 2,
  },
  {
    id: 11,
    formId: 1,
    label: "Preferred Regions",
    type: "checkbox",
    required: true,
    position: 4,
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
  {
    id: 5,
    position: 1,
    fieldId: 11,
    value: "North America",
  },
  {
    id: 6,
    position: 2,
    fieldId: 11,
    value: "Europe",
  },
  {
    id: 7,
    position: 3,
    fieldId: 11,
    value: "Asia",
  },
  {
    id: 8,
    position: 4,
    fieldId: 11,
    value: "South America",
  },
];

const responses: schema.ResponseInsert[] = [
  {
    id: 1,
    userId: "1",
    formId: 1,
  },
  {
    id: 2,
    userId: "2",
    formId: 2,
  },
  {
    id: 3,
    userId: "3",
    formId: 3,
  },
  {
    id: 4,
    userId: "4",
    formId: 4,
  },
  {
    id: 5,
    userId: "5",
    formId: 5,
  },
  {
    id: 6,
    userId: "1",
    formId: 1,
  },
  {
    id: 7,
    userId: "2",
    formId: 1,
  },
  {
    id: 8,
    userId: "3",
    formId: 1,
  },
  {
    id: 9,
    userId: "4",
    formId: 1,
  },
  {
    id: 10,
    userId: "5",
    formId: 1,
  },
  {
    id: 11,
    userId: "6",
    formId: 1,
  },
  {
    id: 12,
    userId: "7",
    formId: 1,
  },
  {
    id: 13,
    userId: "1",
    formId: 1,
  },
  {
    id: 14,
    userId: "2",
    formId: 1,
  },
  {
    id: 15,
    userId: "3",
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
  {
    id: 4,
    responseId: 2,
    fieldId: 4,
    value: "PlayStation",
  },
  {
    id: 5,
    responseId: 2,
    fieldId: 5,
    value: "Kratos",
  },
  {
    id: 6,
    responseId: 3,
    fieldId: 6,
    value: "Great!",
  },
  {
    id: 7,
    responseId: 3,
    fieldId: 7,
    value: "Yes",
  },
  {
    id: 8,
    responseId: 4,
    fieldId: 8,
    value: "Excellent service!",
  },
  {
    id: 9,
    responseId: 5,
    fieldId: 9,
    value: "Inception",
  },
  {
    id: 10,
    responseId: 5,
    fieldId: 10,
    value: "Mind-bending plot and great visuals.",
  },
  {
    id: 11,
    responseId: 6,
    fieldId: 1,
    value: "Sushi",
  },
  {
    id: 12,
    responseId: 6,
    fieldId: 2,
    value: "Edamame",
  },
  {
    id: 13,
    responseId: 6,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 14,
    responseId: 7,
    fieldId: 1,
    value: "Tacos",
  },
  {
    id: 15,
    responseId: 7,
    fieldId: 2,
    value: "Guacamole",
  },
  {
    id: 16,
    responseId: 7,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 17,
    responseId: 8,
    fieldId: 1,
    value: "Pasta",
  },
  {
    id: 18,
    responseId: 8,
    fieldId: 2,
    value: "Garlic Bread",
  },
  {
    id: 19,
    responseId: 8,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 20,
    responseId: 9,
    fieldId: 1,
    value: "Burger",
  },
  {
    id: 21,
    responseId: 9,
    fieldId: 2,
    value: "Fries",
  },
  {
    id: 22,
    responseId: 9,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 23,
    responseId: 10,
    fieldId: 1,
    value: "Salad",
  },
  {
    id: 24,
    responseId: 10,
    fieldId: 2,
    value: "Nuts",
  },
  {
    id: 25,
    responseId: 10,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 26,
    responseId: 11,
    fieldId: 1,
    value: "Steak",
  },
  {
    id: 27,
    responseId: 11,
    fieldId: 2,
    value: "Cheese",
  },
  {
    id: 28,
    responseId: 11,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 29,
    responseId: 12,
    fieldId: 1,
    value: "Ice Cream",
  },
  {
    id: 30,
    responseId: 12,
    fieldId: 2,
    value: "Cookies",
  },
  {
    id: 31,
    responseId: 12,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 32,
    responseId: 13,
    fieldId: 1,
    value: "Pizza",
  },
  {
    id: 33,
    responseId: 13,
    fieldId: 2,
    value: "Wings",
  },
  {
    id: 34,
    responseId: 13,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 35,
    responseId: 14,
    fieldId: 1,
    value: "Curry",
  },
  {
    id: 36,
    responseId: 14,
    fieldId: 2,
    value: "Samosas",
  },
  {
    id: 37,
    responseId: 14,
    fieldId: 3,
    value: undefined,
  },
  {
    id: 38,
    responseId: 15,
    fieldId: 1,
    value: "Dumplings",
  },
  {
    id: 39,
    responseId: 15,
    fieldId: 2,
    value: "Spring Rolls",
  },
  {
    id: 40,
    responseId: 15,
    fieldId: 3,
    value: undefined,
  },
];

const responseFieldOptions: schema.FieldOptionResponseInsert[] = [
  {
    // This should match up to the favorite food form
    // The response should be the radio field with value "sweet"
    id: 1,
    optionId: 1, // Sweet
    responseFieldId: 3,
  },
  {
    id: 2,
    optionId: 2, // Salty
    responseFieldId: 3,
  },
  {
    id: 3,
    optionId: 3, // Sour
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
