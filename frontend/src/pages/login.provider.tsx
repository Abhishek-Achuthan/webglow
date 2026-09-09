import { LoginForm } from '../components/auth/login-form';
import { AuthLayout } from '../components/auth/auth-layout';
import LoginImage from "@/assets/images/login.svg"
export function ProviderLoginPage() {
  return (
    <AuthLayout 
      imageUrl={LoginImage}
      imageAlt="Provider Login Background"
    >
      <LoginForm
        title="Service Provider Login"
        description="Login to manage your services"
        signupRoute="/signup/provider"
        redirectRoute="/provider"
      />
    </AuthLayout>
  );
}
