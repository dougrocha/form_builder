"use client";

import { useForm } from "@tanstack/react-form";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const LoginForm = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please check your credentials and try again.");
      } else {
        redirect("/");
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your existing account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col justify-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
          <form.Field name="password">
            {(field) => (
              <>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={() => form.handleSubmit()}>Log in</Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
