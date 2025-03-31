import { PlusCircle } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Avatar from "~/components/avatar";
import Navbar from "~/components/navbar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { auth } from "~/lib/auth";

export default async function FormPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const forms = [
    { id: 1, title: "Customer Feedback Survey", responses: 24 },
    { id: 2, title: "Employee Satisfaction Survey", responses: 18 },
    { id: 3, title: "Product Feature Request", responses: 37 },
    { id: 4, title: "Event Registration Form", responses: 52 },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-4 py-4 md:flex-row">
        <h1 className="text-2xl font-bold text-gray-800">My Forms</h1>
        <div className="flex justify-between gap-4">
          <Button className="cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
          </Button>
          <Avatar />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card
            key={form.id}
            className="bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">
                {form.title}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {form.responses} responses
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button variant="outline" className="w-full">
                View Responses
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
