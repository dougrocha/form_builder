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
import { caller } from "~/trpc/server";

export default async function FormList() {
  const forms = await caller.form.getAllForms();

  return (
    <>
      {forms.map((form) => (
        <Card
          key={form.id}
          className="bg-white shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-gray-800">
                {form.title}
              </CardTitle>
              <Badge variant="outline">{form.responses} responses</Badge>
            </div>
            <CardDescription className="text-gray-600">
              {form.description}
            </CardDescription>
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
