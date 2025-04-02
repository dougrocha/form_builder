"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formFieldOption, formField, form } from "~/server/db/schema";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "~/auth-client";
import { useState } from "react";
import { useTRPC } from "~/trpc/react";
import { useQuery } from "@tanstack/react-query";

type FormFieldOptionInsert = typeof formFieldOption.$inferInsert;
type FormFieldInsert = typeof formField.$inferInsert & {
  options: FormFieldOptionInsert[];
};
type InsertForm = typeof form.$inferInsert & {
  fields: FormFieldInsert[];
};

type Form = typeof form.$inferSelect;

export default function EditFormPage() {
  const { data: session } = authClient.useSession();

  const { id } = useParams<{ id: string }>();
  const formId = Number(id);

  const trpc = useTRPC();
  const { data: form, isLoading } = useQuery(
    trpc.form.getForm.queryOptions({ id: formId }),
  );

  const [formState, setFormState] = useState<Form | undefined>(form);

  const router = useRouter();
  if (!session) {
    router.push("/");
  }
  if (!form) {
    return <div>Form not found!</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
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
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft />
              Go Back
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
