import { caller, HydrateClient } from "~/trpc/server";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import SignUpForm from "../components/SignUpForm";
import LoginForm from "../components/LoginForm";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Suspense } from "react";
import FormList from "./form/form-list";

export default async function Home() {
  const forms = await caller.form.getAllForms();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <HydrateClient>
      <main className="container mx-auto flex min-h-screen flex-col gap-16 p-4">
        {session ? (
          <div>
            <h1 className="mb-4 text-2xl font-bold">
              You are logged in! Hi {session.user.name}
            </h1>
            <Button>
              <Link href="/form">See your forms</Link>
            </Button>
          </div>
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
        <div>
          <h1 className="mb-8 text-4xl font-bold">Posted Forms</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Suspense fallback="Loading...">
              <FormList />
            </Suspense>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
