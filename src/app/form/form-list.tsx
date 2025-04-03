import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/lib/auth";
import { caller } from "~/trpc/server";

export default async function FormList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const forms = session
    ? await caller.user.getForms()
    : await caller.form.getAllForms();

  return (
    <>
      {forms.map((form) => (
        <Card
          key={form.id}
          className="bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">
              {form.title}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {form.responses} responses
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button variant="outline" className="w-full" asChild>
              <Link href="#">View Responses</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
