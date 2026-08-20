import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-neutral-900">
          Textile &amp; Fashion Value Chain Mapping
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in with the account provided by your project admin.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
