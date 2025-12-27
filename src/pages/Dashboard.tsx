<<<<<<< HEAD
import React from 'react';
import { useDashboardStats, useProjects, useRecentActivities, useMaintenanceRequests, MaintenanceRequest } from '@/hooks/useMockData';
=======
import React, { useState } from 'react';
import { useDashboardStats, useProjects, useRecentActivities, useMaintenanceRequests } from '@/hooks/useMockData';
>>>>>>> 6c7007bb8d6c0deafd611751552116163c230f57
import { StatCard } from '@/components/StatCard';
import { ProjectCardSkeleton } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { FolderKanban, Users, CheckCircle2, TrendingUp, Plus, ArrowRight } from 'lucide-react';
=======
import { Plus, ArrowRight, Monitor, Wrench, Laptop, ExternalLink } from 'lucide-react';
// 👇 1. Import useNavigate
>>>>>>> 6c7007bb8d6c0deafd611751552116163c230f57
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: requests, isLoading: requestsLoading } = useMaintenanceRequests();
<<<<<<< HEAD

  const navigate = useNavigate();
=======
  
  // 👇 2. Initialize Hook
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
>>>>>>> 6c7007bb8d6c0deafd611751552116163c230f57

  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('monitor')) return <Monitor className="h-4 w-4 text-gray-500" />;
    if (cat.includes('computer') || cat.includes('laptop')) return <Laptop className="h-4 w-4 text-gray-500" />;
    return <Wrench className="h-4 w-4 text-gray-500" />;
  };

  // 👇 3. Create a dedicated handler for navigation
  const handleOpenRequest = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation(); // Stop the row from toggling/expanding
    console.log("Navigating to:", `/maintenance/${id}`); // Debug log
    navigate(`/maintenance/${id}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's the overview of your maintenance operations.
          </p>
        </div>
        <Button size="lg" className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Critical Equipment"
          value="5 Units"
          subtext="(Health < 30%)"
          variant="critical"
          isLoading={statsLoading}
        />
        <StatCard
          title="Technician Load"
          value="85% Utilized"
          subtext="(Assign Carefully)"
          variant="primary"
          isLoading={statsLoading}
        />
        <StatCard
          title="Open Requests"
          value="12 Pending"
          subtext="3 Overdue"
          variant="success"
          isLoading={statsLoading}
        />
      </div>

      {/* Main Content: Active Maintenance Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Active Maintenance</h2>
          <Link to="/maintenance">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {requestsLoading ? (
            <div className="p-4 space-y-4">
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
              <ProjectCardSkeleton />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-left text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Employee</th>
                    <th className="px-6 py-4 font-medium">Technician</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Stage</th>
                    <th className="px-6 py-4 font-medium">Company</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {(requests || []).slice(0, 10).map((r: any) => (
                    <tr
                      key={r.id}
<<<<<<< HEAD
                      className="border-t border-border hover:bg-muted/5 cursor-pointer"
                      onClick={() => navigate(`/maintenance/${r.id}`)}
=======
                      className="hover:bg-muted/50 transition-colors cursor-pointer group"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
>>>>>>> 6c7007bb8d6c0deafd611751552116163c230f57
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{r.subject || 'Untitled Request'}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground font-mono">#{r.id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider font-semibold">
                            {r.request_type || 'General'}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground">
                        {r.creator?.full_name || '—'}
                      </td>

                      <td className="px-6 py-4">
                        {r.technician?.full_name ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                              {r.technician.full_name[0]}
                            </div>
                            <span className="text-sm">{r.technician.full_name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Unassigned</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2 text-muted-foreground">
                            {getCategoryIcon(r.equipment?.category)}
                            <span>{r.equipment?.category || r.equipment?.name || '—'}</span>
                         </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${r.stage === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            r.stage === 'in_progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                            r.stage === 'done' ? 'bg-green-50 text-green-700 border-green-200' :
                            'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {r.stage === 'in_progress' ? 'In Progress' : 
                           r.stage === 'new' ? 'New Request' : 
                           r.stage || 'Draft'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-muted-foreground text-xs">
                        {r.company || 'My Company (SF)'}
                      </td>

                      {/* 👇 4. NEW ACTION BUTTON */}
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-primary hover:text-primary hover:bg-primary/10 font-medium"
                          onClick={(e) => handleOpenRequest(e, r.id)}
                        >
                          Open <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  
                  {(!requests || requests.length === 0) && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                        No active maintenance requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}