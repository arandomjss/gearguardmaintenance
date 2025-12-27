import { useState } from 'react';
import { useProjects } from '@/hooks/useMockData';
import { ProjectCard, ProjectCardSkeleton } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type StatusFilter = 'all' | 'active' | 'completed' | 'on-hold' | 'archived';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects?.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Maintenance Work</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and track all your maintenances in one place.
          </p>
        </div>
        <Button size="lg" className="shrink-0">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('grid')}
            className={cn(
              'h-8 px-3',
              viewMode === 'grid' && 'bg-background shadow-sm'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
              'h-8 px-3',
              viewMode === 'list' && 'bg-background shadow-sm'
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      )}>
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
