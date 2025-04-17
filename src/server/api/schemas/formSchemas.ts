import { z } from "zod";

export const FormFieldOptionSchema = z.object({
  id: z.any(),
  value: z.string(),
  position: z.number(),
});

export const FormFieldSchema = z.object({
  id: z.any(),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "email",
    "phone",
    "checkbox",
    "radio",
  ]),
  label: z.string(),
  description: z.string().nullish(),
  position: z.number(),
  required: z.boolean().optional(),
  options: z.array(FormFieldOptionSchema).optional(),
});

export const UpdateFormSchema = z.object({
  formId: z.number(),
  title: z.string(),
  description: z.string().nullish(),
  fields: z.array(FormFieldSchema),
});

export const SubmitFormResponseSchema = z.object({
  formId: z.number(),
  responses: z.array(
    z
      .discriminatedUnion("type", [
        z.object({
          fieldId: z.number(),
          type: z.enum(["text", "textarea"]),
          value: z.string().optional(),
          required: z.boolean(),
        }),
        z.object({
          fieldId: z.number(),
          type: z.literal("email"),
          value: z.string().email().optional().or(z.literal("")),
          required: z.boolean(),
        }),
        z.object({
          fieldId: z.number(),
          type: z.literal("phone"),
          value: z.string().optional(),
          required: z.boolean(),
        }),
        z.object({
          fieldId: z.number(),
          type: z.literal("number"),
          value: z.number().optional(),
          required: z.boolean(),
        }),
        z.object({
          fieldId: z.number(),
          type: z.literal("radio"),
          value: z
            .string()
            .optional()
            .transform((val) => (val !== undefined ? Number(val) : undefined)),
          required: z.boolean(),
        }),
        z.object({
          fieldId: z.number(),
          type: z.literal("checkbox"),
          value: z
            .array(z.string())
            .transform((val) => val.filter((v) => Number(v) !== undefined)),
          required: z.boolean(),
        }),
      ])
      .superRefine((response, ctx) => {
        if (
          response.required &&
          (response.value === undefined ||
            response.value === null ||
            response.value === "" ||
            (Array.isArray(response.value) && response.value.length === 0))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This field is required and must have a value.",
          });
        }
      }),
  ),
});
