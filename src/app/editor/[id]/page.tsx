import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/server/auth";
import { caller, HydrateClient } from "~/trpc/server";
import EditorSidebar from "./editor-sidebar";
import { FormEditorProvider } from "./store";
import EditorPreview from "./editor-preview";

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const formId = Number((await params).id);
  const form = await caller.form.getForm({ id: formId });

  if (!session) {
    return redirect("/");
  }

  if (!form) {
    return <div>Form not found!</div>;
  }

  if (form.creator != session.user.id) {
    return <div>You are not authorized to edit this form!</div>;
  }

  return (
    <HydrateClient>
      <FormEditorProvider>
        <SidebarProvider>
          <EditorPreview />
          <EditorSidebar />
        </SidebarProvider>
      </FormEditorProvider>
    </HydrateClient>
  );
}
