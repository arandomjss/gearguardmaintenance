import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  isLoading?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, className, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className={cn(
        'bg-card rounded-xl border border-border p-6 shadow-card',
        className
      )}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-0.5',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {typeof value === 'number' && title.toLowerCase().includes('revenue') 
              ? `$${value.toLocaleString()}`
              : value.toLocaleString()}
          </p>
          {trend && (
            <p className={cn(
              'mt-2 text-sm font-medium flex items-center gap-1',
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              {Math.abs(trend.value)}%
              <span className="text-muted-foreground font-normal">vs last month</span>
            </p>
          )}
        </div>
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
