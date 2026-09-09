import { createRootRouteWithContext, Outlet, useLocation } from '@tanstack/react-router'
import { ROLES } from '../constants/roles.constant';
import { UserNavbar } from '../components/ui/user-navbar';

interface RouterContext {
  isLoggedin: () => boolean;
  checkRole: (role: ROLES) => boolean;
}

function RootComponent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/admin') || location.pathname.startsWith('/provider');
  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
  
  return (
    <>
      {!isDashboard && !isAuthPage && <UserNavbar />}
      <Outlet />
    </>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});
