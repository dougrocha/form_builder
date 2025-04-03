"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "~/auth-client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { form, formField, formFieldOption } from "~/server/db/schema";
import { useTRPC } from "~/trpc/react";

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
