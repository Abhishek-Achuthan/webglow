import { SignupForm } from '../components/auth/signup-form';
import { AuthLayout } from '../components/auth/auth-layout';
import { ROLES } from '../constants/roles.constant';
import LoginImage from "../assets/images/login.svg"

export function SignupPage() {
  return (
    <AuthLayout 
      imageUrl={LoginImage}
      imageAlt="User Signup Background"
      reverse={true}
    >
      <SignupForm
        title="User Sign Up"
        loginRoute="/login"
        defaultRole={ROLES.USER}
      />
    </AuthLayout>
  );
}
