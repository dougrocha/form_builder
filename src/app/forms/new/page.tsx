import { redirect } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { caller } from "~/trpc/server";
import NewFormSubmitButton from "./new-form-submit-button";

export default function NewForm() {
  const createForm = async (formData: FormData) => {
    "use server";

    const newForm = await caller.form.createForm({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    });

    if (!newForm) {
      return;
    }

    redirect(`/forms`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Form</h1>
      <form action={createForm}>
        <div className="mb-4">
          <Label htmlFor="title" className="mb-2">
            Title
          </Label>
          <Input name="title" type="text" required />
        </div>
        <div className="mb-4">
          <Label htmlFor="description" className="mb-2">
            Description
          </Label>
          <Input name="description" type="text" />
        </div>
        <NewFormSubmitButton />
      </form>
    </div>
  );
}
