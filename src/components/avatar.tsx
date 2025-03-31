"use client";

import { redirect } from "next/navigation";
import { authClient } from "~/auth-client";
import {
  Avatar as AvatarComponent,
  AvatarFallback,
} from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function Avatar() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarComponent className="ml-auto">
          <AvatarFallback className="bg-secondary text-secondary-foreground">
            CN
          </AvatarFallback>
        </AvatarComponent>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await authClient.signOut();
            redirect("/");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
