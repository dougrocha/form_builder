"use client";

import {
  CheckSquare,
  ChevronsUpDown,
  FileText,
  Hash,
  List,
  LogOut,
  Mail,
  Phone,
  Plus,
  Trash2,
  Type,
  type LucideIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "~/components/ui/sidebar";
import { authClient } from "~/lib/auth-client";
import { type FieldType } from "~/server/db/schema";
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

function generateDefaultOptions(type: string, count: number) {
  return Array.from({ length: count }, (_, index) => ({
    id: generateId(`${type}_option`),
    value: `Option ${index + 1}`,
    position: index,
  }));
}

export default function EditorSidebar() {
  const selectedFieldId = useFormEditorStore((s) => s.selectedFieldId);
  const formFields = useFormEditorStore((s) => s.fields);
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
    <Sidebar variant="inset" side="right" className="border-l">
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
                    className="cursor-pointer"
                    onClick={() => {
                      addField({
                        id: generateId("field"),
                        type: fieldType.id,
                        label: fieldType.name,
                        position: formFields.length,
                        options:
                          fieldType.id === "radio" ||
                          fieldType.id === "checkbox"
                            ? generateDefaultOptions(fieldType.id, 3)
                            : undefined,
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
              <div className="space-y-6 p-4">
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
                            value={option.value}
                            onChange={(e) => {
                              updateFormFieldOption(
                                selectedField.id,
                                option.id,
                                {
                                  value: e.target.value,
                                },
                              );
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive h-8 w-8 cursor-pointer transition-colors"
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
                        className="w-full cursor-pointer"
                        onClick={() => {
                          addFormFieldOption(selectedField.id, {
                            id: generateId("field_option"),
                            value: `Option ${(selectedField.options ?? []).length + 1}`,
                            position: (selectedField.options ?? []).length,
                          });
                        }}
                      >
                        <Plus className="h-4 w-4" />
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
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function NavUser() {
  const { isMobile } = useSidebar();

  const { data: session } = authClient.useSession();

  const user = session?.user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {session?.user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {session?.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                redirect("/");
              }}
            >
              <LogOut />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
