"use client";

import { FileText, ChevronDown, Trash2, GripVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "~/components/ui/sidebar";
import { Textarea } from "~/components/ui/textarea";
import { useFormEditorStore } from "./store";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function EditorPreview() {
  const form = useFormEditorStore((s) => s.form);
  const formFields = useFormEditorStore((s) => s.formFields);
  const selectedFieldId = useFormEditorStore((s) => s.selectedFieldId);

  const updateForm = useFormEditorStore((s) => s.updateForm);
  const setSelectedFieldId = useFormEditorStore((s) => s.setSelectedFieldId);
  const moveField = useFormEditorStore((s) => s.moveField);
  const removeField = useFormEditorStore((s) => s.removeField);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-1">
          <Input
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            className="h-9 border-none px-0 text-lg font-semibold focus-visible:ring-0"
          />
        </div>
        <Button>Preview</Button>
        <Button variant="default">Save</Button>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="mx-auto w-full max-w-3xl">
          <CardHeader>
            <CardTitle>
              <Input
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                className="h-9 border-none px-0 text-xl font-semibold focus-visible:ring-0"
              />
            </CardTitle>
            <CardDescription>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="min-h-[60px] resize-none border-none px-0 focus-visible:ring-0"
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
                      className="h-8 w-8"
                      onClick={() => moveField(index, index - 1)}
                      disabled={index === 0}
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveField(index, index + 1)}
                      disabled={index === formFields.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeField(field.id!);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-grab"
                    >
                      <GripVertical className="h-4 w-4" />
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
                      {field.options?.map((option: any) => (
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
                      {field.options?.map((option: any) => (
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
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </div>
    </SidebarInset>
  );
}
