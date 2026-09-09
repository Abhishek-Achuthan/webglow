import { createFileRoute } from '@tanstack/react-router';
import { ProviderSignupPage } from '../pages/signup.provider';

export const Route = createFileRoute('/signup_/provider')({
  component: ProviderSignupPage,
});
