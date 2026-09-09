import { LoginForm } from '../components/auth/login-form';
import { AuthLayout } from '../components/auth/auth-layout';
import LoginImage from "@/assets/images/login.svg"

export function LoginPage() {
  return (
    <AuthLayout 
      imageUrl={LoginImage}
      imageAlt="User Login Background"
    >
      <LoginForm title="User Login" signupRoute="/signup" />
    </AuthLayout>
  );
}
