"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { form, formField, formFieldOption } from "~/server/db/schema";
import { useTRPC } from "~/trpc/react";

export const FormEditorContext = createContext<FormEditorState | null>(null);

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

  const store = useRef(createFormEditorState(form!));

  if (store.current === null) {
    store.current = createFormEditorState(form!);
  }

  return (
    <FormEditorContext.Provider value={store.current}>
      {children}
    </FormEditorContext.Provider>
  );
};

export const useFormEditorStore = <T,>(
  selector: (store: FormEditorStore) => T,
): T => {
  const context = useContext(FormEditorContext);
  if (!context)
    throw new Error("Missing FormEditorContext.Provider in the tree");

  return useStore(context, selector);
};

type FormFieldOptionInsert = typeof formFieldOption.$inferInsert;
type FormFieldInsert = typeof formField.$inferInsert & {
  options: FormFieldOptionInsert[];
};

type Form = typeof form.$inferSelect;

type State = {
  form: Form;
  formFields: FormFieldInsert[];
  selectedFieldId?: number;
};

type Action = {
  setSelectedFieldId: (fieldId?: number) => void;
  updateForm: (form: Partial<Form>) => void;
  addField: (field: FormFieldInsert) => void;
  updateField: (fieldId: number, field: Partial<FormFieldInsert>) => void;
  moveField: (from: number, to: number) => void;
};

type FormEditorStore = State & Action;
type FormEditorState = ReturnType<typeof createFormEditorState>;

export const createFormEditorState = (form: Form) => {
  return createStore<State & Action>()((set) => ({
    form,
    formFields: [],
    selectedFieldId: undefined,

    setSelectedFieldId: (fieldId?: number) =>
      set(() => ({ selectedFieldId: fieldId })),
    updateForm: (form: Partial<Form>) =>
      set((state) => ({ form: { ...state.form, ...form } })),
    addField: (field: FormFieldInsert) =>
      set((state) => ({
        formFields: [...state.formFields, field],
      })),
    updateField: (fieldId: number, field: Partial<FormFieldInsert>) =>
      set((state) => ({
        formFields: state.formFields.map((f) =>
          f.id === fieldId ? { ...f, ...field } : f,
        ),
      })),
    moveField: (from: number, to: number) =>
      set((state) => {
        if (to < 0 || to >= state.formFields.length) return state;

        const newFields = [...state.formFields];
        const movedField = newFields.splice(from, 1);
        newFields.splice(to, 0, ...movedField);

        return {
          formFields: newFields,
        };
      }),
    removeField: (fieldId: number) =>
      set((state) => ({
        formFields: state.formFields.filter((f) => f.id !== fieldId),
        selectedFieldId:
          state.selectedFieldId === fieldId ? undefined : state.selectedFieldId,
      })),
  }));
};
