import FormList from "./form-list";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "~/components/ui/button";

export default async function FormPage() {
  return (
    <>
      <div className="flex flex-col justify-between gap-4 py-4 md:flex-row">
        <h1 className="text-2xl font-bold text-gray-800">My Forms</h1>
        <div className="flex justify-between gap-4">
          <Button className="cursor-pointer" asChild>
            <Link href="/form/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback="Loading...">
          <FormList />
        </Suspense>
      </div>
    </>
  );
}
