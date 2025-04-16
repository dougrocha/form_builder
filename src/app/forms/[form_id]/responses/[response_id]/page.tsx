import { caller } from "~/trpc/server";
import FormNotFound from "../../form-not-found";
import ResponseNotFound from "./response-not-found";
import { tryCatch } from "~/lib/utils";
import { TRPCError } from "@trpc/server";
import UnauthorizedFormAccess from "../../unauthorized-form-access";

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
    <div className="p-4">
      <h1 className="mb-5 text-2xl font-bold text-gray-800">Form Response</h1>
      <div className="rounded-lg border border-gray-300 bg-gray-100 p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-600">
          Response Details
        </h2>
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
          <pre className="overflow-x-auto rounded-md bg-gray-200 p-3 font-mono">
            {JSON.stringify(response, null, 2)}
          </pre>
        </p>
      </div>
    </div>
  );
}
