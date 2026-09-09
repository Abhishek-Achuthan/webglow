import { Link } from '@tanstack/react-router';
import { Home, Search, Calendar, LogOut, User as UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/auth.slice';
import { clearToken } from '../../store/slices/token.slice';
import type { RootState } from '../../store/store';
import { ROLES } from '../../constants/roles.constant';

export function UserNavbar() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearToken());
    window.location.href = '/';
  };

  const isUser = user?.role === ROLES.USER;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            W
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">WebGlow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/services"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground"
          >
            <Search className="w-4 h-4" />
            Browse Services
          </Link>
          
          {isAuthenticated && isUser && (
            <Link
              to="/bookings"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground"
            >
              <Calendar className="w-4 h-4" />
              My Bookings
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 shadow-lg shadow-blue-500/20"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="hidden sm:flex items-center gap-2 text-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="truncate max-w-[120px]">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
