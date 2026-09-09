import { createFileRoute } from '@tanstack/react-router';
import { ProviderLoginPage } from '../pages/login.provider';

export const Route = createFileRoute('/login_/provider')({
  component: ProviderLoginPage,
});
