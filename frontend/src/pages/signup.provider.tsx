import { SignupForm } from '../components/auth/signup-form';
import { AuthLayout } from '../components/auth/auth-layout';
import { ROLES } from '../constants/roles.constant';
import SignupImage from "@/assets/images/signup.svg"

export function ProviderSignupPage() {
  return (
    <AuthLayout 
      imageUrl={SignupImage}
      imageAlt="Provider Signup Background"
      reverse={true}
    >
      <SignupForm
        title="Service Provider Sign Up"
        description="Create a provider account to offer services"
        loginRoute="/login/provider"
        defaultRole={ROLES.PROVIDER}
        redirectRoute="/login/provider"
      />
    </AuthLayout>
  );
}
