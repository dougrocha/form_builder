import { api } from "~/trpc/server";
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

export default async function FormDetail({
  params,
}: {
  params: { id: string };
}) {
  const form = await api.form.getForm({ id: Number(params.id) });

  if (!form) {
    return <div>Form not found!</div>;
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
