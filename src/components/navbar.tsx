import { headers } from "next/headers";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";

import Avatar from "./avatar";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <nav className="flex justify-center py-2.5 border-b-2">
      <h1 className="text-2xl font-bold text-gray-800">
        CSE 412 Project - Forms
      </h1>
      <div className="ml-auto">
        {session ? (
          <Avatar />
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </nav>
  );
}
