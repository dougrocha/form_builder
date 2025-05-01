"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useTRPC } from "~/trpc/react";

export function DeleteFormButton({
  className,
  formId,
}: {
  className?: string;
  formId: number;
}) {
  const router = useRouter();
  const trpc = useTRPC();
  const useQuery = useQueryClient();

  const deleteFormMutation = useMutation(
    trpc.form.deleteForm.mutationOptions({
      onSuccess: () => {
        void useQuery.invalidateQueries({
          queryKey: [trpc.form.getAllForms.queryKey],
        });
        void useQuery.invalidateQueries({
          queryKey: [trpc.user.getForms.queryKey],
        });
        router.refresh();
      },
    }),
  );

  return (
    <Button
      className={className}
      variant="destructive"
      size="sm"
      onClick={() => {
        void deleteFormMutation.mutate({ formId });
      }}
    >
      {deleteFormMutation.isPending ? (
        <>
          <Loader className="animate-spin" />
          Deleting...
        </>
      ) : (
        <>
          <Trash /> Delete
        </>
      )}
    </Button>
  );
}
