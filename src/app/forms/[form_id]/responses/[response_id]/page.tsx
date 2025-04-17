import { TRPCError } from "@trpc/server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { tryCatch } from "~/lib/utils";
import { caller } from "~/trpc/server";
import FormNotFound from "../../form-not-found";
import UnauthorizedFormAccess from "../../unauthorized-form-access";
import ResponseNotFound from "./response-not-found";

export default async function FormResponsePage({
  params,
}: {
  params: Promise<{ form_id: string; response_id: string }>;
}) {
  const formId = Number((await params).form_id);
  const responseId = Number((await params).response_id);

  const form = await caller.form.getForm({ id: formId });
  const [response, response_error] = await tryCatch(() =>
    caller.form.getFormResponse({
      formId: formId,
      responseId,
    }),
  );

  if (!form) {
    return <FormNotFound />;
  }

  if (
    response_error instanceof TRPCError &&
    response_error.code == "UNAUTHORIZED"
  ) {
    return <UnauthorizedFormAccess />;
  }

  if (!response) {
    return <ResponseNotFound formId={formId} />;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardTitle className="mb-4 text-2xl font-bold">Form Response</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">
          <strong>Form ID:</strong> {formId}
        </p>
        <p className="mb-2">
          <strong>Response ID:</strong> {responseId}
        </p>
        <p className="mb-2">
          <strong>Form Name:</strong> {form.title}
        </p>
        <p>
          <strong>Response Content:</strong>
        </p>
        <pre className="bg-accent overflow-x-auto rounded-md p-3 font-mono">
          {JSON.stringify(response, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
