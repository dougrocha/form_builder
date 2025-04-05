import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function CreateNewFormButton({ className }: { className?: string }) {
  return (
    <Button className={cn("cursor-pointer", className)} asChild>
      <Link href="/forms/new">
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
      </Link>
    </Button>
  );
}
