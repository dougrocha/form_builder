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

export default function FormResponseNotFound() {
  return (
    <div className="flex min-h-full flex-grow items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Form Not Found</CardTitle>
          <CardDescription>
            The form you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="link">
            <Link href="/forms" className="flex items-center text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to forms
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
