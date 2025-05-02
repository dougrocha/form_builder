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
    title: "Favorite Food",
    description: "What is your favorite food?",
    creator: "1",
  },
  {
    title: "Favorite Game",
    description: "What is your favorite game?",
    creator: "2",
  },
  {
    title: "Visit Feedback",
    description: "How was your visit today?",
    creator: "5",
  },
  {
    title: "User Feedback",
    description: "Please provide your feedback about our service.",
    creator: "4",
  },
  {
    title: "Favorite Movie",
    description: "What is your favorite movie and why?",
    creator: "6",
  },
];

const fields = (form: schema.Form[]): schema.FieldInsert[] => {
  return [
    {
      formId: form[0]!.id,
      label: "Favorite Dish",
      type: "text",
      required: true,
      position: 1,
    },
    {
      formId: form[0]!.id,
      label: "Favorite Snack",
      type: "text",
      required: true,
      position: 2,
    },
    {
      formId: form[0]!.id,
      label: "Taste Preference",
      type: "radio",
      required: true,
      position: 3,
    },
    {
      formId: form[1]!.id,
      label: "Preferred Console",
      type: "text",
      required: true,
      position: 1,
    },
    {
      formId: form[1]!.id,
      label: "Favorite Character",
      type: "text",
      required: true,
      position: 2,
    },
    {
      formId: form[2]!.id,
      label: "Overall Experience",
      type: "textarea",
      required: true,
      position: 1,
    },
    {
      formId: form[2]!.id,
      label: "Would you recommend us?",
      type: "text",
      required: true,
      position: 2,
    },
    {
      formId: form[3]!.id,
      label: "Feedback",
      type: "textarea",
      required: true,
      position: 1,
    },
    {
      formId: form[4]!.id,
      label: "Favorite Movie",
      type: "text",
      required: true,
      position: 1,
    },
    {
      formId: form[4]!.id,
      label: "Reason",
      type: "textarea",
      required: true,
      position: 2,
    },
    {
      formId: form[0]!.id,
      label: "Preferred Regions",
      type: "checkbox",
      required: true,
      position: 4,
    },
  ];
};

const options = (fields: schema.Field[]): schema.FieldOptionInsert[] => {
  return [
    {
      position: 1,
      fieldId: fields[2]!.id,
      value: "Sweet",
    },
    {
      position: 2,
      fieldId: fields[2]!.id,
      value: "Salty",
    },
    {
      position: 3,
      fieldId: fields[2]!.id,
      value: "Sour",
    },
    {
      position: 4,
      fieldId: fields[2]!.id,
      value: "Savory",
      deletedAt: new Date(),
      isDeleted: true,
    },
    {
      position: 1,
      fieldId: fields[10]!.id,
      value: "North America",
    },
    {
      position: 2,
      fieldId: fields[10]!.id,
      value: "Europe",
    },
    {
      position: 3,
      fieldId: fields[10]!.id,
      value: "Asia",
    },
    {
      position: 4,
      fieldId: fields[10]!.id,
      value: "South America",
    },
  ];
};

const responses = (forms: schema.Form[]): schema.ResponseInsert[] => {
  return [
    {
      userId: "1",
      formId: forms[0]!.id,
    },
    {
      userId: "2",
      formId: forms[1]!.id,
    },
    {
      userId: "3",
      formId: forms[2]!.id,
    },
    {
      userId: "4",
      formId: forms[3]!.id,
    },
    {
      userId: "5",
      formId: forms[4]!.id,
    },
    {
      userId: "1",
      formId: forms[0]!.id,
    },
    {
      userId: "2",
      formId: forms[0]!.id,
    },
    {
      userId: "3",
      formId: forms[0]!.id,
    },
    {
      userId: "4",
      formId: forms[0]!.id,
    },
    {
      userId: "5",
      formId: forms[0]!.id,
    },
    {
      userId: "6",
      formId: forms[0]!.id,
    },
    {
      userId: "7",
      formId: forms[0]!.id,
    },
    {
      userId: "1",
      formId: forms[0]!.id,
    },
    {
      userId: "2",
      formId: forms[0]!.id,
    },
    {
      userId: "3",
      formId: forms[0]!.id,
    },
  ];
};

const responseFields = (
  responses: schema.Response[],
  fields: schema.Field[],
): schema.FieldResponseInsert[] => {
  return [
    {
      responseId: responses[0]!.id,
      fieldId: fields[0]!.id,
      value: "Pizza",
    },
    {
      responseId: responses[0]!.id,
      fieldId: fields[0]!.id,
      value: "Chips",
    },
    {
      responseId: responses[0]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[1]!.id,
      fieldId: fields[3]!.id,
      value: "PlayStation",
    },
    {
      responseId: responses[1]!.id,
      fieldId: fields[4]!.id,
      value: "Kratos",
    },
    {
      responseId: responses[2]!.id,
      fieldId: fields[5]!.id,
      value: "Great!",
    },
    {
      responseId: responses[2]!.id,
      fieldId: fields[6]!.id,
      value: "Yes",
    },
    {
      responseId: responses[3]!.id,
      fieldId: fields[7]!.id,
      value: "Excellent service!",
    },
    {
      responseId: responses[4]!.id,
      fieldId: fields[8]!.id,
      value: "Inception",
    },
    {
      responseId: responses[4]!.id,
      fieldId: fields[9]!.id,
      value: "Mind-bending plot and great visuals.",
    },
    {
      responseId: responses[5]!.id,
      fieldId: fields[0]!.id,
      value: "Sushi",
    },
    {
      responseId: responses[5]!.id,
      fieldId: fields[1]!.id,
      value: "Edamame",
    },
    {
      responseId: responses[5]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[6]!.id,
      fieldId: fields[0]!.id,
      value: "Tacos",
    },
    {
      responseId: responses[6]!.id,
      fieldId: fields[1]!.id,
      value: "Guacamole",
    },
    {
      responseId: responses[6]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[7]!.id,
      fieldId: fields[0]!.id,
      value: "Pasta",
    },
    {
      responseId: responses[7]!.id,
      fieldId: fields[1]!.id,
      value: "Garlic Bread",
    },
    {
      responseId: responses[7]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[8]!.id,
      fieldId: fields[0]!.id,
      value: "Burger",
    },
    {
      responseId: responses[8]!.id,
      fieldId: fields[1]!.id,
      value: "Fries",
    },
    {
      responseId: responses[8]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[9]!.id,
      fieldId: fields[0]!.id,
      value: "Salad",
    },
    {
      responseId: responses[9]!.id,
      fieldId: fields[1]!.id,
      value: "Nuts",
    },
    {
      responseId: responses[9]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[10]!.id,
      fieldId: fields[0]!.id,
      value: "Steak",
    },
    {
      responseId: responses[10]!.id,
      fieldId: fields[1]!.id,
      value: "Cheese",
    },
    {
      responseId: responses[10]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[11]!.id,
      fieldId: fields[0]!.id,
      value: "Ice Cream",
    },
    {
      responseId: responses[11]!.id,
      fieldId: fields[1]!.id,
      value: "Cookies",
    },
    {
      responseId: responses[11]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[12]!.id,
      fieldId: fields[0]!.id,
      value: "Pizza",
    },
    {
      responseId: responses[12]!.id,
      fieldId: fields[1]!.id,
      value: "Wings",
    },
    {
      responseId: responses[12]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[13]!.id,
      fieldId: fields[0]!.id,
      value: "Curry",
    },
    {
      responseId: responses[13]!.id,
      fieldId: fields[1]!.id,
      value: "Samosas",
    },
    {
      responseId: responses[13]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
    {
      responseId: responses[14]!.id,
      fieldId: fields[0]!.id,
      value: "Dumplings",
    },
    {
      responseId: responses[14]!.id,
      fieldId: fields[1]!.id,
      value: "Spring Rolls",
    },
    {
      responseId: responses[14]!.id,
      fieldId: fields[2]!.id,
      value: undefined,
    },
  ];
};

const responseFieldOptions = (
  responseFields: schema.FieldResponse[],
  options: schema.FieldOption[],
): schema.FieldOptionResponseInsert[] => {
  return [
    {
      // This should match up to the favorite food form
      // The response should be the radio field with value "sweet"
      optionId: options[0]!.id, // Sweet
      responseFieldId: responseFields[2]!.id,
    },
    {
      optionId: options[1]!.id, // Salty
      responseFieldId: responseFields[2]!.id,
    },
    {
      optionId: options[2]!.id, // Sour
      responseFieldId: responseFields[2]!.id,
    },
  ];
};

async function main() {
  await reset(db, schema);

  await db.insert(schema.user).values(users).returning();
  await db.insert(schema.account).values(accounts).returning();

  const updateForms = await db.insert(schema.form).values(forms).returning();
  const updateFields = await db
    .insert(schema.field)
    .values(fields(updateForms))
    .returning();
  const updateOptions = await db
    .insert(schema.fieldOption)
    .values(options(updateFields))
    .returning();

  const updateResponse = await db
    .insert(schema.response)
    .values(responses(updateForms))
    .returning();
  const updateFieldResponse = await db
    .insert(schema.fieldResponse)
    .values(responseFields(updateResponse, updateFields))
    .returning();
  await db
    .insert(schema.fieldOptionResponse)
    .values(responseFieldOptions(updateFieldResponse, updateOptions))
    .returning();
}

await main();
