import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { tryCatch } from "~/lib/utils";
import { caller } from "~/trpc/server";
import FormNotFound from "../form-not-found";
import UnauthorizedFormAccess from "../unauthorized-form-access";

export default async function FormResponsesPage({
  params,
}: {
  params: Promise<{ form_id: string }>;
}) {
  const formId = Number((await params).form_id);
  const form = await caller.form.getForm({ id: formId });
  const [responses, response_error] = await tryCatch(() =>
    caller.form.getAllFormResponses({ formId: formId }),
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

  if (!responses) {
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
    <div className="min-h-full bg-gray-100 p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">
        Responses for {form.title}
      </h1>
      {responses.length === 0 ? (
        <p className="text-gray-600">No responses found for this form.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg border border-gray-200 bg-white shadow-md">
            <thead className="bg-gray-200">
              <tr>
                {Object.keys(responses[0]!).map((key) => (
                  <th
                    key={key}
                    className="border-b px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {key}
                  </th>
                ))}
                <th
                  key="viewResponse"
                  className="border-b px-4 py-2 text-left text-sm font-medium text-gray-700"
                >
                  View Response
                </th>
              </tr>
            </thead>
            <tbody>
              {responses?.map((response, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    {response.id}
                  </td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    {response.formId}
                  </td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    {response.userId}
                  </td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    {response.createdAt.toLocaleDateString()}
                  </td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    {response.fieldResponses.length}
                  </td>
                  <td className="border-b px-4 py-2 text-sm text-gray-800">
                    <Button variant="default" asChild>
                      <Link href={`/forms/${formId}/responses/${response.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
