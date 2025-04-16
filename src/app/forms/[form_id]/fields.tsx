"use client";

import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import type { FormFieldWithOptions } from "~/server/db/schema/form";
import { useFieldContext } from "./form";

interface FormFieldProps {
  form_field: FormFieldWithOptions;
}

export function TextField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="Enter text"
      />
    </div>
  );
}

export function TextAreaField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        className="w-full rounded border p-2"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
    </div>
  );
}

export function CheckboxField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string[]>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <div className="space-y-2">
        {form_field.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.value}
              onCheckedChange={(checked) => {
                const id = String(option.id);
                if (checked) {
                  field.setValue([...field.state.value, id]);
                } else {
                  field.setValue(field.state.value.filter((val) => val !== id));
                }
              }}
            />
            <Label htmlFor={option.value}>{option.value}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RadioField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <RadioGroup
        onValueChange={(e) => {
          field.setValue(e);
        }}
      >
        {form_field.options?.map((option) => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={String(option.id)} id={option.value} />
            <Label htmlFor={option.value}>{option.value}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

export function NumberField({ form_field }: FormFieldProps) {
  const field = useFieldContext<number>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        placeholder="0"
      />
    </div>
  );
}

export function EmailField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="email"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="name@example.com"
      />
    </div>
  );
}

export function PhoneNumberField({ form_field }: FormFieldProps) {
  const field = useFieldContext<string>();

  return (
    <div className="grid w-full gap-1.5">
      <Label className="text-base">
        {form_field.label}{" "}
        {form_field.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type="tel"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder="+1 (555) 000-0000"
      />
    </div>
  );
}
