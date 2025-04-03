"use client";

import { useForm } from "@tanstack/react-form";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authClient } from "~/auth-client";
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

const SignUpForm = () => {
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
      });

      if (error) {
        console.error("SignUp failed:", error);
        alert("SignUp failed. Please check your credentials and try again.");
      } else {
        redirect("/");
      }
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new account by filling out the form below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <form.Field name="name">
            {(field) => (
              <>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            )}
          </form.Field>
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
        <Button className="cursor-pointer" onClick={() => form.handleSubmit()}>
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignUpForm;
