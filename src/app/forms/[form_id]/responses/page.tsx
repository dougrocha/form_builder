import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { caller, HydrateClient } from "~/trpc/server";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) {
  const formId = Number((await params).form_id);

  const form = await caller.form.getForm({ id: formId });

  if (!form) {
    return notFound();
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="mb-4 flex items-center text-2xl font-bold">
          Responses for {form?.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HydrateClient>
          <DataTable rowCount={form.responses ?? 0} columns={columns} />
        </HydrateClient>
      </CardContent>
    </Card>
  );
}
