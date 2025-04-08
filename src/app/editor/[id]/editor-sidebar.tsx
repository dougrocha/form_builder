"use client";

import {
  CheckSquare,
  FileText,
  Hash,
  List,
  Mail,
  Phone,
  Plus,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import type { FieldType } from "~/server/db/schema";
import { useFormEditorStore } from "./store";

export const generateId = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).substring(2, 9)}`;

const fieldTypes: {
  id: FieldType;
  name: string;
  icon: LucideIcon;
}[] = [
  { id: "text", name: "Text Field", icon: Type },
  { id: "textarea", name: "Text Area", icon: FileText },
  { id: "number", name: "Number", icon: Hash },
  { id: "email", name: "Email", icon: Mail },
  { id: "phone", name: "Phone", icon: Phone },
  { id: "checkbox", name: "Checkbox", icon: CheckSquare },
  { id: "radio", name: "Radio Group", icon: List },
];

export default function EditorSidebar() {
  const selectedFieldId = useFormEditorStore((s) => s.selectedFieldId);
  const formFields = useFormEditorStore((s) => s.formFields);
  const addField = useFormEditorStore((s) => s.addField);
  const updateField = useFormEditorStore((s) => s.updateField);
  const updateFormFieldOption = useFormEditorStore(
    (s) => s.updateFormFieldOption,
  );
  const addFormFieldOption = useFormEditorStore((s) => s.addFormFieldOption);
  const removeFormFieldOption = useFormEditorStore(
    (s) => s.removeFormFieldOption,
  );

  const selectedField = formFields.find(
    (field) => field.id === selectedFieldId,
  );

  return (
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
                    onClick={() => {
                      addField({
                        id: generateId("field"),
                        type: fieldType.id,
                        label: fieldType.name,
                        position: formFields.length,
                        options: [],
                      });
                    }}
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
              <div className="space-y-6 p-2">
                <div>
                  <Label className="mb-2 block" htmlFor="field-label">
                    Label
                  </Label>
                  <Input
                    id="field-label"
                    value={selectedField.label}
                    onChange={(e) =>
                      updateField(selectedField.id, {
                        label: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="field-required"
                    checked={selectedField.required}
                    onCheckedChange={(checked) =>
                      updateField(selectedField.id, {
                        required: !!checked,
                      })
                    }
                  />
                  <Label htmlFor="field-required">Required field</Label>
                </div>

                {(selectedField.type === "radio" ||
                  selectedField.type === "checkbox") && (
                  <div>
                    <Label className="mb-2 block">Options</Label>
                    <div className="space-y-2">
                      {selectedField.options?.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2"
                        >
                          <Input
                            value={option.label}
                            onChange={(e) => {
                              updateFormFieldOption(
                                selectedField.id,
                                option.id,
                                {
                                  label: e.target.value,
                                },
                              );
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8"
                            onClick={() => {
                              removeFormFieldOption(
                                selectedField.id,
                                option.id,
                              );
                            }}
                            disabled={
                              selectedField.options &&
                              selectedField.options.length <= 1
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          addFormFieldOption(selectedField.id, {
                            id: generateId("field_option"),
                            label: `Option ${(selectedField.options ?? []).length + 1}`,
                            position: (selectedField.options ?? []).length,
                          });
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
  );
}
