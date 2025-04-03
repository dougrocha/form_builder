import FormNavbar from "~/components/navbar";

export default async function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <FormNavbar />
      <main>{children}</main>
    </div>
  );
}
