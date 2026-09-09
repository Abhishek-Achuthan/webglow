import { LoginForm } from '../components/auth/login-form';
import { AuthLayout } from '../components/auth/auth-layout';
import LoginImage from "@/assets/images/login.svg"

export function AdminLoginPage() {
  return (
    <AuthLayout 
      imageUrl={LoginImage}
      imageAlt="Admin Login Background"
    >
      <LoginForm
        title="Admin Login"
        description="Login to access the admin dashboard"
        redirectRoute="/admin"
      />
    </AuthLayout>
  );
}
