"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, FileText, Loader, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";
import { useFormEditorStore } from "./store";

export default function EditorPreview() {
  const form = useFormEditorStore((s) => s.form);
  const formFields = useFormEditorStore((s) => s.fields);
  const selectedFieldId = useFormEditorStore((s) => s.selectedFieldId);
  const updateForm = useFormEditorStore((s) => s.updateForm);
  const setSelectedFieldId = useFormEditorStore((s) => s.setSelectedFieldId);
  const moveField = useFormEditorStore((s) => s.moveField);
  const removeField = useFormEditorStore((s) => s.removeField);
  const updateState = useFormEditorStore((s) => s.updateState);

  const trpc = useTRPC();
  const useQuery = useQueryClient();
  const updateFormMutation = useMutation(
    trpc.form.updateForm.mutationOptions({
      onSuccess: (data) => {
        if (data) {
          updateState(data);
        }

        void useQuery.invalidateQueries({
          queryKey: [trpc.form.getForm.queryKey, { id: form.id }],
        });
      },
    }),
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      formId: form.id,
      title: form.title,
      description: form.description,
      fields: formFields,
    };
    updateFormMutation.mutate(formData);
  };

  return (
    <SidebarInset>
      <header className="bg-background sticky top-0 z-99 flex h-16 w-full shrink-0 items-center gap-2 border-b px-4">
        <h1 className="flex-1 border-none text-lg font-semibold">
          {form.title || "Enter a Title"}
        </h1>
        <Button variant="outline" asChild>
          <Link href="/forms">
            <FileText className="mr-2 h-4 w-4" /> My Forms
          </Link>
        </Button>
        <Button
          variant="default"
          disabled={updateFormMutation.isPending}
          type="submit"
          onClick={handleSubmit}
        >
          {updateFormMutation.isPending ? (
            <>
              <Loader className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Separator orientation="vertical" className="ml-2 h-4" />
        <SidebarTrigger className="-mr-1 rotate-180" />
      </header>
      <div className="flex flex-1 flex-col gap-4 overflow-auto p-4">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle>
              <Input
                value={form.title}
                placeholder="Enter a Title"
                onChange={(e) => updateForm({ title: e.target.value })}
                className="h-9 border-none text-xl font-semibold focus-visible:ring-0"
                aria-label="Form title"
                required
              />
            </CardTitle>
            <CardDescription>
              <Textarea
                value={form.description ?? ""}
                placeholder="Enter a description"
                onChange={(e) => updateForm({ description: e.target.value })}
                className="min-h-[60px] resize-none border-none focus-visible:ring-0"
                aria-label="Form description"
                required
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formFields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="text-muted-foreground/50 mb-4 h-12 w-12" />
                <h3 className="text-lg font-medium">No fields added yet</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Add form fields from the sidebar to get started
                </p>
              </div>
            ) : (
              formFields.map((field, index) => (
                <Card
                  key={field.id}
                  className={`relative rounded-lg border p-4 ${selectedFieldId === field.id ? "ring-primary ring-2" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedFieldId === field.id}
                  aria-label={`Edit ${field.label} field`}
                  onClick={() => setSelectedFieldId(field.id)}
                  onFocus={() => setSelectedFieldId(field.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedFieldId(field.id);
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-2">
                      <Label className="text-base">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-destructive">*</span>
                        )}
                      </Label>
                      <Badge className="ml-auto">{field.type}</Badge>
                      <div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveField(index, index - 1)}
                          disabled={index === 0}
                          aria-label="Move field up"
                        >
                          <ChevronDown className="h-4 w-4 rotate-180" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => moveField(index, index + 1)}
                          disabled={index === formFields.length - 1}
                          aria-label="Move field down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                          aria-label={`Remove ${field.label} field`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {field.type === "text" && (
                      <Input placeholder="Enter text" tabIndex={-1} />
                    )}

                    {field.type === "textarea" && (
                      <Textarea placeholder="Enter text" tabIndex={-1} />
                    )}

                    {field.type === "number" && (
                      <Input type="number" placeholder="0" tabIndex={-1} />
                    )}

                    {field.type === "email" && (
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        tabIndex={-1}
                      />
                    )}

                    {field.type === "phone" && (
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        tabIndex={-1}
                      />
                    )}

                    {field.type === "checkbox" && (
                      <div className="space-y-2">
                        {field.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox id={option.id} />
                            <Label htmlFor={option.id}>{option.value}</Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {field.type === "radio" && (
                      <RadioGroup>
                        {field.options?.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id}>{option.value}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={true} className="w-full">
              Preview Form Submission
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  );
}
