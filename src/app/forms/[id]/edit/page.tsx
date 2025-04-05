import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { auth } from "~/server/auth";
import { caller } from "~/trpc/server";
import FormBuilder from "./form-builder";

export default async function EditFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const formId = Number((await params).id);
  const form = await caller.form.getForm({ id: formId });

  if (!session) {
    return redirect("/");
  }

  if (!form) {
    return <div>Form not found!</div>;
  }

  if (form.creator != session.user.id) {
    return <div>You are not authorized to edit this form!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">{form.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            <p>{form.description}</p>
            <p>Number of Responses: {form.responses}</p>
            <p>Status: {form.published ? "Published" : "Draft"}</p>
            <p>Created at: {form.createdAt.toLocaleDateString()}</p>
            <p>
              Last updated:{" "}
              {form.updatedAt ? form.updatedAt.toLocaleDateString() : "Never"}
            </p>
          </>
        </CardContent>
      </Card>
      <FormBuilder form={form} />
    </div>
  );
}
