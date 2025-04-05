"use client";

import { generateId } from "better-auth";
import {
  Calendar,
  CheckSquare,
  ChevronDown,
  FileText,
  Hash,
  List,
  Mail,
  Phone,
  Image,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import { Button } from "~/components/ui/button";
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
import { useFormEditorStore } from "./store";
import { Checkbox } from "~/components/ui/checkbox";

const fieldTypes = [
  { id: "text", name: "Text Field", icon: Type },
  { id: "textarea", name: "Text Area", icon: FileText },
  { id: "number", name: "Number", icon: Hash },
  { id: "email", name: "Email", icon: Mail },
  { id: "phone", name: "Phone", icon: Phone },
  { id: "checkbox", name: "Checkbox", icon: CheckSquare },
  { id: "radio", name: "Radio Group", icon: List },
  { id: "select", name: "Dropdown", icon: ChevronDown },
  { id: "date", name: "Date Picker", icon: Calendar },
  { id: "image", name: "Image Upload", icon: Image },
];

export default function EditorSidebar() {
  const selectedFieldId = useFormEditorStore((s) => s.selectedFieldId);
  const formFields = useFormEditorStore((s) => s.formFields);

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
                                const newOptions = selectedField.options.filter(
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
  );
}
