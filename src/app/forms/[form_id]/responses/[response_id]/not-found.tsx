import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

interface Props {
  params: Promise<{ form_id: string }>;
}

export default async function ResponseNotFound({ params }: Props) {
  const { form_id } = await params;

  return (
    <div className="flex min-h-full flex-grow items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Response Not Found</CardTitle>
          <CardDescription>
            The response you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="link">
            <Link
              href={`/forms/${form_id}`}
              className="flex items-center text-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to form
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
