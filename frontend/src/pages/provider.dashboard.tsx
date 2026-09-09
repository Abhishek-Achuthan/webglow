import { Link } from '@tanstack/react-router';
import { Plus, BarChart3, Users, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function ProviderDashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's an overview of your provider services.</p>
        </div>
        <Link to="/provider/services/new">
          <Button className="w-full md:w-auto h-11 px-6 shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-blue-500/50">
            <Plus className="w-4 h-4 mr-2" />
            Create New Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-card border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Services</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">0</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-green-400">Manage</span> your offerings
          </div>
        </Card>
        
        <Card className="p-6 bg-card border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">0</h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span className="text-foreground">Awaiting your first booking</span>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customers</p>
              <h3 className="text-3xl font-bold text-foreground mt-1">0</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Users className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            Grow your audience
          </div>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Services Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          You haven't created any services yet. Start offering your expertise by creating your first service listing.
        </p>
        <Link to="/provider/services/new">
          <Button variant="outline" className="border-border hover:bg-accent hover:text-accent-foreground">
            Create Service
          </Button>
        </Link>
      </div>
    </div>
  );
}
