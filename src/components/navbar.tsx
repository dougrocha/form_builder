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
    <nav className="flex justify-center p-2.5">
      <div>CSE 412 Project Forms</div>
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
