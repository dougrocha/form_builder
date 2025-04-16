"use client";

import { useMutation } from "@tanstack/react-query";
import { ChevronDown, FileText, Loader, Trash2 } from "lucide-react";
import Link from "next/link";
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

  const trpc = useTRPC();
  const updateFormMutation = useMutation(
    trpc.form.updateForm.mutationOptions(),
  );

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <div className="flex-1 border-none text-lg font-semibold">
          {form.title || "Enter a Title"}
        </div>
        <Button className="cursor-pointer" variant="outline" asChild>
          <Link href="/forms">
            <FileText className="mr-2 h-4 w-4" /> My Forms
          </Link>
        </Button>
        <Button
          className="cursor-pointer"
          variant="default"
          disabled={updateFormMutation.isPending}
          onClick={() => {
            const formData = {
              id: form.id,
              title: form.title,
              description: form.description,
              fields: formFields,
            };
            updateFormMutation.mutate(formData);
          }}
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
        <SidebarTrigger className="-mr-1 rotate-180 cursor-pointer" />
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
              />
            </CardTitle>
            <CardDescription>
              <Textarea
                value={form.description ?? ""}
                placeholder="Enter a description"
                onChange={(e) => updateForm({ description: e.target.value })}
                className="min-h-[60px] resize-none border-none focus-visible:ring-0"
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
                <div
                  key={field.id}
                  className={`relative rounded-lg border p-4 ${selectedFieldId === field.id ? "ring-primary ring-2" : ""}`}
                  onClick={() => setSelectedFieldId(field.id)}
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => moveField(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                      onClick={() => moveField(index, index + 1)}
                      disabled={index === formFields.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <Label className="text-base">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                  </div>

                  {field.type === "text" && <Input placeholder="Enter text" />}

                  {field.type === "textarea" && (
                    <Textarea placeholder="Enter text" />
                  )}

                  {field.type === "number" && (
                    <Input type="number" placeholder="0" />
                  )}

                  {field.type === "email" && (
                    <Input type="email" placeholder="name@example.com" />
                  )}

                  {field.type === "phone" && (
                    <Input type="tel" placeholder="+1 (555) 000-0000" />
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
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full cursor-pointer">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  );
}
