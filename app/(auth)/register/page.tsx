import { RegisterForm } from "@/app/(auth)/components/register-form";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Image
            src="/logo-athletix.png"
            alt="Logo Athletix"
            width={60}
            height={60}
          />
          <span className="text-lg tracking-tight">Athletix.</span>
        </Link>
        <RegisterForm />
      </div>
    </div>
  );
}
