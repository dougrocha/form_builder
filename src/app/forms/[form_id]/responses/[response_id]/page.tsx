import { TRPCError } from "@trpc/server";
import { X } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { tryCatch } from "~/lib/utils";
import { caller } from "~/trpc/server";
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

  if (
    response_error instanceof TRPCError &&
    response_error.code == "UNAUTHORIZED"
  ) {
    return <UnauthorizedFormAccess />;
  }

  if (!form) {
    return notFound();
  }

  if (!response) {
    return notFound();
  }

  const responseDate = new Date(response.createdAt);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="text-2xl font-bold">{form.title}</CardTitle>
              <CardDescription className="mt-1">
                Response #{responseId} submitted on{" "}
                {responseDate.toLocaleString(undefined, {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </CardDescription>
            </div>
            {response?.user?.name && (
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground text-sm">
                  Submitted by:
                </span>
                <Badge variant="outline" className="text-sm font-medium">
                  {response.user.name}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Response Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {response.fieldResponses.map((fieldResponse, index) => (
              <div key={`response_${fieldResponse.id}`} className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-foreground font-medium">
                    {fieldResponse.field.label}
                  </h3>
                  {fieldResponse.field.description && (
                    <p className="text-muted-foreground text-sm">
                      {fieldResponse.field.description}
                    </p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-md p-3">
                  {fieldResponse.field.type === "radio" ||
                  fieldResponse.field.type === "checkbox" ? (
                    <div className="flex flex-wrap gap-2">
                      {fieldResponse.options.length > 0 ? (
                        <>
                          {fieldResponse.options.map((option) => (
                            <Badge
                              key={`selected_option_${option.id}`}
                              variant="default"
                            >
                              {option.option.value}
                            </Badge>
                          ))}
                          {form.fields
                            .find((field) => field.id === fieldResponse.fieldId)
                            ?.options.filter(
                              (option) =>
                                !fieldResponse.options.some(
                                  (fieldResponseOption) =>
                                    fieldResponseOption.id === option.id,
                                ),
                            )
                            .map((option) => (
                              <Badge
                                key={`not_selected_${option.id}`}
                                variant="destructive"
                              >
                                <X /> {option.value}
                              </Badge>
                            ))}
                        </>
                      ) : (
                        <span className="text-muted-foreground italic">
                          No option selected
                        </span>
                      )}
                    </div>
                  ) : fieldResponse.value ? (
                    <p className="font-medium">{fieldResponse.value}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No response provided
                    </p>
                  )}
                </div>

                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span>Field ID: {fieldResponse.fieldId}</span>
                  <span>•</span>
                  <span>Type: {fieldResponse.field.type}</span>
                  <span>•</span>
                  <span>
                    {fieldResponse.field.required ? "Required" : "Optional"}
                  </span>
                </div>
                {index < response.fieldResponses.length - 1 && (
                  <Separator className="mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <details className="rounded-lg border p-2">
        <summary className="cursor-pointer p-2 font-medium">
          Raw Response Data
        </summary>
        <pre className="bg-accent mt-2 overflow-x-auto rounded-md p-3 font-mono text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      </details>
    </div>
  );
}
