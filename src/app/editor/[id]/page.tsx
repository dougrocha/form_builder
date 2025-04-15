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
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold">Form not found!</h2>
          <p className="text-muted-foreground">
            The form you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (form.creator != session.user.id) {
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-2 text-2xl font-bold">Unauthorized</h2>
          <p className="text-muted-foreground">
            You are not authorized to edit this form!
          </p>
        </div>
      </div>
    );
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
