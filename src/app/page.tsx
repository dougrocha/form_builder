import { FileText, Loader } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import UserAvatar from "~/components/user-avatar";
import { auth } from "~/server/auth";
import LoginForm from "../components/auth/login-form";
import SignUpForm from "../components/auth/signup-form";
import { CreateNewFormButton } from "./forms/create-new-form-button";
import FormList from "./form-list";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <div className="container mx-auto flex flex-grow flex-col px-4 py-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {session ? (
            <>
              <div className="flex items-center gap-4 md:items-baseline">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {session.user.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Manage and customize your forms
                  </p>
                </div>
                <div className="ml-auto md:hidden">
                  <UserAvatar />
                </div>
              </div>
              <div className="grid gap-2 md:ml-auto md:flex">
                <Button variant="outline" asChild>
                  <Link href="/forms">
                    <FileText className="mr-2 h-4 w-4" /> My Forms
                  </Link>
                </Button>
                <CreateNewFormButton />
              </div>
              <div className="hidden md:block">
                <UserAvatar />
              </div>
            </>
          ) : (
            <Tabs defaultValue="login" className="flex w-full justify-center">
              <TabsList className="w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="signup">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          )}
        </header>

        {session && (
          <main className="flex flex-grow flex-col">
            <h2 className="mb-8 text-2xl font-semibold">
              Recently Posted Forms
            </h2>
            <ErrorBoundary fallback="Something went wrong">
              <Suspense
                fallback={
                  <div className="flex min-h-full flex-grow items-center justify-center">
                    <Loader className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                  <FormList />
                </div>
              </Suspense>
            </ErrorBoundary>
          </main>
        )}
      </div>
    </>
  );
}
