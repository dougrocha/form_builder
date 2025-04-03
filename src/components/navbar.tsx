import UserAvatar from "./avatar";

export default async function FormNavbar() {
  return (
    <nav className="flex justify-center border-b-2 py-2.5">
      <h1 className="text-2xl font-bold text-gray-800">
        CSE 412 Project - Forms
      </h1>
      <div className="ml-auto">
        <UserAvatar />
      </div>
    </nav>
  );
}
