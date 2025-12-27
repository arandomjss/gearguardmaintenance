import { useDashboardStats, useProjects, useRecentActivities } from '@/hooks/useMockData';
import { StatCard } from '@/components/StatCard';
import { ProjectCard, ProjectCardSkeleton } from '@/components/ProjectCard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { Button } from '@/components/ui/button';
import { FolderKanban, Users, CheckCircle2, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  const activeProjects = projects?.filter(p => p.status === 'active').slice(0, 3) || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <Button size="lg" className="shrink-0">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Stats Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"> {/* Changed to grid-cols-3 to match sketch */}
  
  {/* Card 1: Critical Equipment (Red) */}
  <StatCard
    title="Critical Equipment"
    value="5 Units"
    subtext="(Health < 30%)"
    variant="critical"
    isLoading={statsLoading}
  />

  {/* Card 2: Technician Load (Blue) */}
  <StatCard
    title="Technician Load"
    value="85% Utilized"
    subtext="(Assign Carefully)"
    variant="primary"
    isLoading={statsLoading}
  />

  {/* Card 3: Open Requests (Green) */}
  {/* Note: I combined the 12 Pending and 3 Overdue into value/subtext to match layout */}
  <StatCard
    title="Open Requests"
    value="12 Pending"
    subtext="3 Overdue"
    variant="success"
    isLoading={statsLoading}
  />

</div>
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 lg:gap-8">
        {/* Active Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Active Maintenance</h2>
            <Link to="/projects">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4">
            {projectsLoading ? (
              <>
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
                <ProjectCardSkeleton />
              </>
            ) : (
              activeProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <div className="bg-card rounded-xl border border-border p-4 shadow-card">
            <ActivityFeed
              activities={activities || []}
              isLoading={activitiesLoading}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}
