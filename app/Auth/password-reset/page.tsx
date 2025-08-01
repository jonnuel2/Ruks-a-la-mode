import { Suspense } from "react";
import PasswordResetPage from "./passwordResetPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
      <PasswordResetPage />
    </Suspense>
  );
}
