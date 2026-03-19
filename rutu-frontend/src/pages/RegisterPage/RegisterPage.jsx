import { RegisterForm } from "./RegisterForm";
import { AuthLayout } from "@layouts/AuthLayout/AuthLayout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Buat Akunmu!"
      description="Isi kredensial untuk membuat akun RuangTumbuh baru!"
      linkText="Sudah mempunyai akun?"
      linkActionText="Masuk"
      linkTo="/login"
      reverse={true} // Posisi dibalik (Form kiri, Gambar kanan)
    >
      <RegisterForm />
    </AuthLayout>
  );
}
