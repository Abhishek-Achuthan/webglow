import { Outlet, Link } from '@tanstack/react-router';
import { List, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/auth.slice';
import { clearToken } from '../store/slices/token.slice';

export function AdminLayoutPage() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearToken());
    window.location.href = '/login/admin';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]">
              A
            </div>
            <span className="font-semibold text-lg tracking-tight">Admin Panel</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium">

            <Link
              to="/admin/services"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground"
            >
              <List className="w-4 h-4" />
              Services
            </Link>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors [&.active]:text-foreground"
            >
              <List className="w-4 h-4" />
              Bookings
            </Link>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-rose-400 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
