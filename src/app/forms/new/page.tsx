"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useTRPC } from "~/trpc/react";

const newFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long."),
});

export default function NewForm() {
  const router = useRouter();
  const trpc = useTRPC();
  const useQuery = useQueryClient();

  const createFormMutation = useMutation(
    trpc.form.createForm.mutationOptions({
      onSuccess: () => {
        router.push("/forms");
      },
      onSettled: () => {
        void useQuery.invalidateQueries({
          queryKey: [trpc.form.getAllForms.queryKey],
        });
        void useQuery.invalidateQueries({
          queryKey: [trpc.user.getForms.queryKey],
        });
      },
    }),
  );

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onChange: newFormSchema,
    },
    onSubmit: async ({ formApi, value }) => {
      await createFormMutation.mutateAsync(value);

      formApi.reset();
    },
  });

  return (
    <div className="container mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Create New Form</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <div>
          <form.Field
            name="title"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name} className="mb-2">
                    Title
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter the title"
                    type="text"
                    required
                    aria-required="true"
                    aria-invalid={
                      field.state.meta.isBlurred && !field.state.meta.isValid
                    }
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {field.state.meta.errors
                        .map((error) => error?.message)
                        .join(", ")}
                    </p>
                  ) : null}
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="description"
            children={(field) => {
              return (
                <>
                  <Label htmlFor={field.name} className="mb-2">
                    Description
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter the description"
                    type="text"
                    aria-required="true"
                    aria-invalid={
                      field.state.meta.isBlurred && !field.state.meta.isValid
                    }
                  />
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <p className="text-destructive mt-2 text-sm font-medium">
                      {field.state.meta.errors
                        .map((error) => error?.message)
                        .join(", ")}
                    </p>
                  ) : null}
                </>
              );
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className={"w-full lg:w-auto"}
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Form"
              )}
            </Button>
          )}
        />
      </form>
    </div>
  );
}
