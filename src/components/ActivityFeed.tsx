import { Activity } from '@/lib/mock-api';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderPlus, CheckCircle2, UserPlus, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  activities: Activity[];
  isLoading?: boolean;
}

const activityIcons = {
  project_created: FolderPlus,
  task_completed: CheckCircle2,
  member_joined: UserPlus,
  comment_added: MessageSquare,
};

const activityColors = {
  project_created: 'bg-blue-100 text-blue-600',
  task_completed: 'bg-emerald-100 text-emerald-600',
  member_joined: 'bg-purple-100 text-purple-600',
  comment_added: 'bg-amber-100 text-amber-600',
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        const colorClass = activityColors[activity.type];

        return (
          <div
            key={activity.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn('p-2 rounded-full shrink-0', colorClass)}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-muted-foreground">{activity.message.replace(activity.user, '').trim()}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
