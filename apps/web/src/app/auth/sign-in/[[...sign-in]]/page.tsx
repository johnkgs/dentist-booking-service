import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignIn path="/auth/sign-in" />
    </main>
  );
}
