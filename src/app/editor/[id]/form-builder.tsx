"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { generateId } from "better-auth";
import {
  ChevronDown,
  FileText,
  GripVertical,
  Hash,
  Mail,
  Phone,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useStore } from "zustand";
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";
import { createFormEditorState } from "./store";

const fieldTypes = [
  { id: "text", name: "Text Field", icon: Type },
  { id: "textarea", name: "Text Area", icon: FileText },
  { id: "number", name: "Number", icon: Hash },
  { id: "email", name: "Email", icon: Mail },
  { id: "phone", name: "Phone", icon: Phone },
  // { id: "checkbox", name: "Checkbox", icon: CheckSquare },
  // { id: "radio", name: "Radio Group", icon: List },
  // { id: "select", name: "Dropdown", icon: ChevronDown },
  // { id: "date", name: "Date Picker", icon: Calendar },
  // { id: "image", name: "Image Upload", icon: Image },
];

export default function FormBuilder() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const trpc = useTRPC();

  const { data: original_form } = useSuspenseQuery(
    trpc.form.getForm.queryOptions({ id }),
  );

  const store = useStore(createFormEditorState(original_form!));

  const selectedField = store.formFields.find(
    (field) => field.id === store.selectedFieldId,
  );

  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <Input
              value={store.form.title}
              onChange={(e) => store.updateForm({ title: e.target.value })}
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
                  value={store.form.title}
                  onChange={(e) => store.updateForm({ title: e.target.value })}
                  className="h-9 border-none px-0 text-xl font-semibold focus-visible:ring-0"
                />
              </CardTitle>
              <CardDescription>
                <Textarea
                  value={store.form.description ?? ""}
                  onChange={(e) =>
                    store.updateForm({ description: e.target.value })
                  }
                  className="min-h-[60px] resize-none border-none px-0 focus-visible:ring-0"
                />
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {store.formFields.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="text-muted-foreground/50 mb-4 h-12 w-12" />
                  <h3 className="text-lg font-medium">No fields added yet</h3>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Add form fields from the sidebar to get started
                  </p>
                </div>
              ) : (
                store.formFields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`relative rounded-lg border p-4 ${store.selectedFieldId === field.id ? "ring-primary ring-2" : ""}`}
                    onClick={() => store.setSelectedFieldId(field.id)}
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => store.moveField(index, index - 1)}
                        disabled={index === 0}
                      >
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => store.moveField(index, index + 1)}
                        disabled={index === store.formFields.length - 1}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          // store.removeField(field.id);
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

                    {field.type === "text" && (
                      <Input placeholder="Enter text" />
                    )}

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
                        {field.options.map((option: any) => (
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
                        {field.options.map((option: any) => (
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

      <Sidebar variant="inset" side="right">
        <SidebarHeader>
          <div className="p-2">
            <h2 className="px-2 py-1 text-lg font-semibold">Form Builder</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Add Fields</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {fieldTypes.map((fieldType) => (
                  <SidebarMenuItem key={fieldType.id}>
                    <SidebarMenuButton
                    // onClick={() => store.addField(fieldType.id)}
                    >
                      <fieldType.icon className="h-4 w-4" />
                      <span>{fieldType.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {selectedField && (
            <SidebarGroup>
              <SidebarGroupLabel>Field Properties</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-4 p-2">
                  <div>
                    <Label htmlFor="field-label">Label</Label>
                    <Input
                      id="field-label"
                      value={selectedField.label}
                      // onChange={(e) =>
                      // store.updateField(selectedField.id, {
                      //   label: e.target.value,
                      // })
                      // }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="field-required"
                      checked={selectedField.required}
                      // onCheckedChange={(checked) =>
                      // store.updateField(selectedField.id, {
                      //   required: !!checked,
                      // })
                      //}
                    />
                    <Label htmlFor="field-required">Required field</Label>
                  </div>

                  {(selectedField.type === "radio" ||
                    selectedField.type === "checkbox") && (
                    <div>
                      <Label className="mb-2 block">Options</Label>
                      <div className="space-y-2">
                        {selectedField.options.map(
                          (option: any, index: number) => (
                            <div
                              key={option.id}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={option.value}
                                onChange={(e) => {
                                  const newOptions = [...selectedField.options];
                                  newOptions[index] = {
                                    ...option,
                                    value: e.target.value,
                                  };
                                  // store.updateField(selectedField.id, {
                                  //   options: newOptions,
                                  // });
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive h-8 w-8"
                                onClick={() => {
                                  const newOptions =
                                    selectedField.options.filter(
                                      (o: any) => o.id !== option.id,
                                    );
                                  // store.updateField(selectedField.id, {
                                  //   options: newOptions,
                                  // });
                                }}
                                disabled={selectedField.options.length <= 1}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const newOptions = [
                              ...selectedField.options,
                              {
                                id: generateId(),
                                value: `Option ${selectedField.options.length + 1}`,
                              },
                            ];
                            // store.updateField(selectedField.id!, {
                            //   options: newOptions,
                            // });
                          }}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
}
