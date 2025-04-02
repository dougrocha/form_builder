import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function NewForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create a new form in the database
    const newFormId = await api.form.createForm({ title, description });

    router.push(`/form/${newFormId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Create New Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <Button type="submit">Create Form</Button>
      </form>
    </div>
  );
}
