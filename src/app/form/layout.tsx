import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "~/components/navbar";
import { auth } from "~/lib/auth";

export default async function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="container mx-auto min-h-screen bg-white p-4">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
