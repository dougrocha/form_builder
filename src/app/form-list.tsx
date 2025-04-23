import { headers } from "next/headers";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/server/auth";
import { caller } from "~/trpc/server";

export default async function FormList() {
  const forms = await caller.form.getAllForms();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <p>Please log in to view the forms.</p>;
  }

  return (
    <>
      {forms.map((form) => (
        <Card key={form.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{form.title}</CardTitle>
              <Badge variant="outline">{form.responses} responses</Badge>
            </div>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button size="sm" asChild>
              <Link href={`/forms/${form.id}`}>Fill Out</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
