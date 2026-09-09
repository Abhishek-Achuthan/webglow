import { createFileRoute } from '@tanstack/react-router';
import { AdminLoginPage } from '../pages/login.admin';

export const Route = createFileRoute('/login_/admin')({
  component: AdminLoginPage,
});
