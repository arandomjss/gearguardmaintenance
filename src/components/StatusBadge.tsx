import { cn } from '@/lib/utils';

type Status = 'active' | 'completed' | 'on-hold' | 'archived';
type Priority = 'low' | 'medium' | 'high' | 'critical';

interface StatusBadgeProps {
  status?: Status;
  priority?: Priority;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  'on-hold': 'bg-amber-50 text-amber-700 border-amber-200',
  archived: 'bg-zinc-100 text-zinc-600 border-zinc-200',
};

const priorityStyles: Record<Priority, string> = {
  low: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  medium: 'bg-blue-50 text-blue-700 border-blue-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
};

export function StatusBadge({ status, priority, className }: StatusBadgeProps) {
  const label = status || priority;
  const styles = status ? statusStyles[status] : priority ? priorityStyles[priority] : '';

  if (!label) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
        styles,
        className
      )}
    >
      {label.replace('-', ' ')}
    </span>
  );
}
