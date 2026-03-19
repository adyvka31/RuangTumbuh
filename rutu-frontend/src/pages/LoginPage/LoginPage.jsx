import { LoginForm } from "./LoginForm";
import { AuthLayout } from "@layouts/AuthLayout/AuthLayout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Selamat Datang, Bro!"
      description="Sebelum memulai, isi detail Anda untuk masuk ke Dasbor RuangTumbuh."
      linkText="Belum mempunyai akun?"
      linkActionText="Daftar"
      linkTo="/register"
    >
      <LoginForm />
    </AuthLayout>
  );
}
