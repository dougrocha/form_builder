import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { caller, HydrateClient } from "~/trpc/server";
import Form from "./form";
import FormNotFound from "./form-not-found";

export default async function FormPage({
  params,
}: {
  params: Promise<{ form_id: number }>;
}) {
  const formId = Number((await params).form_id);
  const form = await caller.form.getForm({ id: formId });

  if (!form) {
    return <FormNotFound />;
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <HydrateClient>
            <Form form={form} />
          </HydrateClient>
        </CardContent>
      </Card>
    </div>
  );
}
