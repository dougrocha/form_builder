import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { caller, HydrateClient } from "~/trpc/server";
import { SidebarProvider } from "~/components/ui/sidebar";
import EditorSidebar from "./editor-sidebar";
import { useRef } from "react";
import { createFormEditorState, FormEditorProvider } from "./store";

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
          Hello
          <EditorSidebar />
          {/* <Card> */}
          {/*   <CardHeader> */}
          {/*     <CardTitle className="text-lg text-gray-800"> */}
          {/*       {form.title} */}
          {/*     </CardTitle> */}
          {/*   </CardHeader> */}
          {/*   <CardContent> */}
          {/*     <> */}
          {/*       <p>{form.description}</p> */}
          {/*       <p>Number of Responses: {form.responses}</p> */}
          {/*       <p>Status: {form.published ? "Published" : "Draft"}</p> */}
          {/*       <p>Created at: {form.createdAt.toLocaleDateString()}</p> */}
          {/*       <p> */}
          {/*         Last updated:{" "} */}
          {/*         {form.updatedAt ? form.updatedAt.toLocaleDateString() : "Never"} */}
          {/*       </p> */}
          {/*     </> */}
          {/*   </CardContent> */}
          {/* </Card> */}
          {/* <FormBuilder /> */}
        </SidebarProvider>
      </FormEditorProvider>
    </HydrateClient>
  );
}
