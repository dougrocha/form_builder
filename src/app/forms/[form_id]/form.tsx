"use client";

import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Loader } from "lucide-react";
import { Button } from "~/components/ui/button";
import { tryCatch } from "~/lib/utils";
import type { FormWithFields } from "~/server/db/schema";
import { useTRPC } from "~/trpc/react";
import {
  CheckboxField,
  EmailField,
  NumberField,
  PhoneNumberField,
  RadioField,
  TextAreaField,
  TextField,
} from "./fields";
import Link from "next/link";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    NumberField,
    CheckboxField,
    RadioField,
    PhoneNumberField,
    EmailField,
    TextAreaField,
  },
  formComponents: {},
});

interface Props {
  form: FormWithFields;
}

export default function SubmissionForm({ form: form_data }: Props) {
  const trpc = useTRPC();
  const submitFormMutation = useMutation(
    trpc.form.submitFormResponse.mutationOptions(),
  );

  const form = useAppForm({
    defaultValues: {
      ...form_data.fields.reduce((acc, field) => {
        let defaultValue;
        switch (field.type) {
          case "checkbox":
            defaultValue = [];
            break;
          case "number":
            defaultValue = 0;
            break;
          default:
            defaultValue = "";
        }

        return {
          ...acc,
          [`field_${field.id}`]: defaultValue,
        };
      }, {}),
    } as Record<`field_${number}`, string | string[] | number>,
    onSubmit: async ({ formApi, value }) => {
      const [data, error] = await tryCatch(() =>
        submitFormMutation.mutateAsync({
          formId: form_data.id,
          responses: Object.entries(value).map(([key, val]) => {
            const fieldId = Number(key.replace("field_", ""));
            const field = form_data.fields.find((f) => f.id === fieldId)!;

            // Typecheck on server
            return {
              fieldId,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
              value: val as any,
              type: field.type,
              required: field.required,
            };
          }),
        }),
      );

      if (error) {
        console.error("Submit error", error);
      }

      if (data?.success) {
        formApi.reset();
      }
    },
  });

  if (form_data.fields.length === 0) {
    return (
      <>
        <p>
          There are currently no fields available in this form. Please check
          back later when the creator updates the form.
        </p>
        <Button className="mt-4" asChild variant="link">
          <Link href="/forms">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back to forms
          </Link>
        </Button>
      </>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      {form_data.fields.map((field_data) => {
        return (
          <form.AppField
            key={field_data.id}
            name={`field_${field_data.id}`}
            mode={["checkbox"].includes(field_data.type) ? "array" : "value"}
            // eslint-disable-next-line react/no-children-prop
            children={(field) => {
              const FieldComponent = {
                radio: field.RadioField,
                checkbox: field.CheckboxField,
                number: field.NumberField,
                phone: field.PhoneNumberField,
                email: field.EmailField,
                textarea: field.TextAreaField,
                text: field.TextField,
              }[field_data.type];

              return <FieldComponent form_field={field_data} />;
            }}
          />
        );
      })}
      <form.AppForm>
        <form.Subscribe
          selector={(state) => state.isSubmitting}
          // eslint-disable-next-line react/no-children-prop
          children={(isSubmitting) => {
            return (
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader className="h-8 w-8 animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </Button>
                <Button
                  variant="secondary"
                  type="reset"
                  disabled={isSubmitting}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>
            );
          }}
        />
      </form.AppForm>
    </form>
  );
}
