import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function EditorFormNotFound() {
  return (
    <main className="flex flex-grow flex-col">
      <div className="flex min-h-full flex-grow items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Editor Form Not Found</CardTitle>
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
    </main>
  );
}
