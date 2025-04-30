import { headers } from "next/headers";
import UserAvatar from "~/components/user-avatar";
import { auth } from "~/server/auth";
import { CreateNewFormButton } from "./create-new-form-button";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { FileText, Home } from "lucide-react";

export default async function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto flex flex-grow flex-col px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex w-full justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {session?.user.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and customize your forms
              </p>
            </div>
            <UserAvatar className="ml-2 md:hidden" />
          </div>
        </div>
        <div className="grid gap-2 md:ml-auto md:flex">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/forms">
              <FileText className="mr-2 h-4 w-4" /> My Forms
            </Link>
          </Button>
          <CreateNewFormButton />
          <UserAvatar className="ml-2 hidden md:block" />
        </div>
      </header>
      <main className="flex flex-grow flex-col">{children}</main>
    </div>
  );
}
