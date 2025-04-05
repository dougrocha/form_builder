"use client";

import { Loader } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "~/components/ui/button";

export default function NewFormSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="cursor-pointer" type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader className="animate-spin" />
          Creating...
        </>
      ) : (
        "Create Form"
      )}
    </Button>
  );
}
