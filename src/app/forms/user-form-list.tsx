import { FileText } from "lucide-react";
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
import { CreateNewFormButton } from "./create-new-form-button";

export default async function UserFormList() {
  const forms = await caller.user.getForms();

  return (
    <>
      {forms.length > 0 ? (
        forms.map((form) => (
          <Card key={form.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <Badge variant="outline">{form.responses} responses</Badge>
              </div>
              <CardDescription>{form.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto flex gap-2">
              <Button size="sm" asChild>
                <Link href={`/forms/${form.id}/responses`}>View Responses</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild className="ml-auto">
                <Link href={`/editor/${form.id}`}>Edit</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/forms/${form.id}`}>Fill Out</Link>
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="col-span-full py-10">
          <CardContent className="flex flex-col items-center justify-center">
            <FileText className="mb-4 h-12 w-12" />
            <h3 className="mb-2 text-xl font-medium">No forms yet</h3>
            <p className="mb-4 text-center">Create your first form!</p>
            <CreateNewFormButton />
          </CardContent>
        </Card>
      )}
    </>
  );
}
