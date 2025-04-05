import { headers } from "next/headers";
import UserAvatar from "~/components/user-avatar";
import { auth } from "~/server/auth";
import { BackButton } from "./back-button";
import { CreateNewFormButton } from "./create-new-form-button";

export default async function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-full">
            <div className="mb-2 flex items-center">
              <BackButton />
              <UserAvatar className="ml-auto md:hidden" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {session?.user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and customize your forms
            </p>
          </div>
        </div>
        <CreateNewFormButton className="md:ml-auto" />
        <UserAvatar className="hidden md:block" />
      </header>
      <main>{children}</main>
    </div>
  );
}
