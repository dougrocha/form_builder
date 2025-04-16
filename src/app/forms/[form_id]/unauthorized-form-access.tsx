import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

export default function UnauthorizedFormAccess() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <Card className="w-full max-w-md bg-yellow-50">
        <CardHeader className="text-center">
          <CardTitle className="text-yellow-600">Unauthorized Access</CardTitle>
          <CardDescription>
            You do not have permission to access this form.
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

