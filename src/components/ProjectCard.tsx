import { Link } from 'react-router-dom';
import { Project } from '@/lib/mock-api';
import { StatusBadge } from './StatusBadge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link
      to={`/maintenance/${project.id}`}
      className={cn(
        'group block bg-card rounded-xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/20',
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {project.name}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
        <StatusBadge priority={project.priority} />
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-2" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            <span>{project.members.length}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map(tag => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-md"
          >
            {tag}
          </span>
        ))}
        {project.tags.length > 3 && (
          <span className="px-2 py-0.5 text-xs text-muted-foreground">
            +{project.tags.length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="mt-4 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-md" />
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-5 w-12 rounded-md" />
      </div>
    </div>
  );
}
