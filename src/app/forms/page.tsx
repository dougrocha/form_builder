import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UserFormList from "./user-form-list";

export default async function FormPage() {
  return (
    <>
      <h2 className="mb-8 text-2xl font-semibold">Your Forms</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ErrorBoundary fallback="Something went wrong">
          <Suspense fallback="Loading...">
            <UserFormList />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}
