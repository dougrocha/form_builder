"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    pathParts.pop();
    const parentPath = pathParts.length ? `/${pathParts.join("/")}` : "/";
    router.push(parentPath);
  };

  return (
    <Button variant="ghost" onClick={handleBack}>
      <ArrowLeft className="h-5 w-5" />
      <span className="ml-2">Back</span>
    </Button>
  );
}
