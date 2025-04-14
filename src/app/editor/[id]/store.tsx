"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import type {
  FieldType,
  Form,
  FormFieldWithOptions,
  FormWithFields,
} from "~/server/db/schema";
import { useTRPC } from "~/trpc/react";

type EditorFormField = {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  position: number;
  required?: boolean;
  options?: EditorFormFieldOption[];
};

type EditorFormFieldOption = {
  id: string;
  value: string;
  position: number;
};

type State = {
  form: Form;
  fields: EditorFormField[];
  selectedFieldId?: string;
};

type Action = {
  setSelectedFieldId: (fieldId?: string) => void;
  updateForm: (form: Partial<Form>) => void;
  addField: (field: EditorFormField) => void;
  updateField: (fieldId: string, field: Partial<EditorFormField>) => void;
  moveField: (from: number, to: number) => void;
  removeField: (fieldId: string) => void;
  addFormFieldOption: (fieldId: string, option: EditorFormFieldOption) => void;
  updateFormFieldOption: (
    fieldId: string,
    optionId: string,
    option: Partial<EditorFormFieldOption>,
  ) => void;
  removeFormFieldOption: (fieldId: string, optionId: string) => void;
};

type FormEditorStore = State & Action;
type FormEditorState = ReturnType<typeof createFormEditorStore>;

function transformFormField(field: FormFieldWithOptions): EditorFormField {
  return {
    id: String(field.id),
    type: field.type,
    label: field.label,
    description: field.description ?? undefined,
    position: field.position,
    required: field.required,
    options: field.options?.map((option) => ({
      id: String(option.id),
      value: option.value,
      position: option.position,
    })),
  };
}

export const createFormEditorStore = (form: FormWithFields) => {
  return createStore<State & Action>()((set) => ({
    form,
    fields: form.fields.map(transformFormField),
    selectedFieldId: undefined,

    setSelectedFieldId: (fieldId?: string) =>
      set(() => ({ selectedFieldId: fieldId })),
    updateForm: (form: Partial<Form>) =>
      set((state) => ({ form: { ...state.form, ...form } })),
    addField: (field: EditorFormField) =>
      set((state) => ({
        fields: [...state.fields, field],
      })),
    updateField: (fieldId: string, field: Partial<EditorFormField>) =>
      set((state) => ({
        fields: state.fields.map((f) =>
          f.id === fieldId ? { ...f, ...field } : f,
        ),
      })),
    moveField: (from: number, to: number) =>
      set((state) => {
        if (to < 0 || to >= state.fields.length) return state;

        const newFields = [...state.fields];
        const movedField = newFields.splice(from, 1);
        newFields.splice(to, 0, ...movedField);

        return {
          fields: newFields,
        };
      }),
    removeField: (fieldId: string) =>
      set((state) => ({
        fields: state.fields.filter((f) => f.id !== fieldId),
        selectedFieldId:
          state.selectedFieldId === fieldId ? undefined : state.selectedFieldId,
      })),
    addFormFieldOption: (fieldId: string, option: EditorFormFieldOption) =>
      set((state) => ({
        fields: state.fields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: [...(field.options ?? []), option],
              }
            : field,
        ),
      })),
    updateFormFieldOption: (
      fieldId: string,
      optionId: string,
      option: Partial<EditorFormFieldOption>,
    ) =>
      set((state) => ({
        fields: state.fields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: field.options?.map((opt) =>
                  opt.id === optionId ? { ...opt, ...option } : opt,
                ),
              }
            : field,
        ),
      })),
    removeFormFieldOption: (fieldId: string, optionId: string) =>
      set((state) => ({
        fields: state.fields.map((field) =>
          field.id === fieldId
            ? {
                ...field,
                options: field.options?.filter((opt) => opt.id !== optionId),
              }
            : field,
        ),
      })),
  }));
};

export const FormEditorContext = createContext<FormEditorState | null>(null);

export const useFormEditorStore = <T,>(
  selector: (store: FormEditorStore) => T,
): T => {
  const context = useContext(FormEditorContext);
  if (!context)
    throw new Error("Missing FormEditorContext.Provider in the tree");

  return useStore(context, selector);
};

export const FormEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const trpc = useTRPC();

  const { data: form } = useSuspenseQuery(
    trpc.form.getForm.queryOptions({ id }),
  );

  const store = useRef(createFormEditorStore(form!));

  store.current ??= createFormEditorStore(form!);

  return (
    <FormEditorContext.Provider value={store.current}>
      {children}
    </FormEditorContext.Provider>
  );
};
