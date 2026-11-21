import { LoginForm } from "@/features/auth";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100/50 via-background to-purple-950/20 p-4">
      <LoginForm />
    </div>
  );
}
