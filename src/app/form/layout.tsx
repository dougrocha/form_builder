export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto min-h-screen bg-white p-6">
      {children}
    </div>
  );
}
