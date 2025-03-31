import { headers } from "next/headers";
import { auth } from "~/lib/auth";
import LoginForm from "./LoginForm";
import { redirect } from "next/navigation";

export const User = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return <LoginForm />;

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <form
        action={async () => {
          "use server";
          await auth.api.signOut({
            headers: await headers(),
          });
          redirect("/");
        }}
      >
        <button type="submit">Logout</button>
      </form>
    </div>
  );
};
