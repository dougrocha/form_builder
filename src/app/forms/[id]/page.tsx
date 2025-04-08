import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { caller } from "~/trpc/server";

export default async function FormPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const formId = Number((await params).id);
  const form = await caller.form.getForm({ id: formId });

  if (!form) {
    return <div>Form not found!</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">{form.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{form.description}</p>
          {/* Add more form details here */}
        </CardContent>
      </Card>
    </div>
  );
}
