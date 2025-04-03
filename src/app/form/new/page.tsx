import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api, caller, prefetch } from "~/trpc/server";

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

    redirect(`/form/${newForm.id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Form</h1>
      <form action={createForm}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <Input name="title" type="text" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <Input name="description" type="text" />
        </div>
        <Button type="submit">Create Form</Button>
      </form>
    </div>
  );
}
