import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export default function FormNotFound() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <Card className="w-full max-w-md bg-red-50">
        <CardHeader className="text-center">
          <CardTitle className="text-red-600">Form Not Found</CardTitle>
          <CardDescription>
            The form you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Link
            href="/forms"
            className="text-muted-foreground hover:text-foreground flex items-center text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to forms
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
