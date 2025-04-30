import { Loader } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserFormList from "./user-form-list";

export default async function FormPage() {
  return (
    <>
      <h2 className="mb-8 text-2xl font-semibold">Your Forms</h2>
      <ErrorBoundary fallback="Something went wrong">
        <Suspense
          fallback={
            <div className="flex min-h-full flex-grow items-center justify-center">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            <UserFormList />
          </div>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
