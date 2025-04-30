import { TRPCError } from "@trpc/server";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { tryCatch } from "~/lib/utils";
import { caller } from "~/trpc/server";
import UnauthorizedFormAccess from "../unauthorized-form-access";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { notFound } from "next/navigation";

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) {
  const formId = Number((await params).form_id);
  const [form, form_error] = await tryCatch(() =>
    caller.form.getFormWithResponses({ formId: formId }),
  );

  if (!form) {
    return notFound();
  }

  if (form_error instanceof TRPCError && form_error.code == "UNAUTHORIZED") {
    return <UnauthorizedFormAccess />;
  }

  if (!form) {
    return (
      <div className="min-h-full bg-gray-100 p-6">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          Error loading responses
        </h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="mb-4 flex items-center text-2xl font-bold">
          Responses for {form.title}
          <Badge className="ml-4">{form.responses.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={form.responses} />
      </CardContent>
    </Card>
  );
}
