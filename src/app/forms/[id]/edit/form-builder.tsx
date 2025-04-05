import { FileText, Hash, Mail, Phone, Type } from "lucide-react";
import { createStore, useStore } from "zustand";
import { formField, formFieldOption, type form } from "~/server/db/schema";

type FormFieldOptionInsert = typeof formFieldOption.$inferInsert;
type FormFieldInsert = typeof formField.$inferInsert & {
  options: FormFieldOptionInsert[];
};

type Form = typeof form.$inferSelect;

interface CreateFormState {
  form: Form;
  formFields: FormFieldInsert[];
  setForm: (form: Form) => void;
  addField: (field: FormFieldInsert) => void;
}

const createFormState = (form: Form) => {
  return createStore<CreateFormState>()((set) => ({
    form,
    formFields: [],
    setForm: () => set((state) => ({ form: state.form })),
    addField: (field: FormFieldInsert) =>
      set((state) => ({
        formFields: [...state.formFields, field],
      })),
  }));
};

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

export default function FormBuilder({ form }: { form: Form }) {
  const store = useStore(createFormState(form));

  return <Side
}
