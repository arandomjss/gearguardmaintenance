import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type CardVariant = 'default' | 'critical' | 'primary' | 'success';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string; // New prop for the text below the value
  icon?: LucideIcon; // Made optional since your sketch doesn't show icons
  variant?: CardVariant; // New prop to control color themes
  className?: string;
  isLoading?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card border-border text-foreground',
  critical: 'bg-red-50 border-red-200 text-red-900', // Red theme
  primary: 'bg-blue-50 border-blue-200 text-blue-900', // Blue theme
  success: 'bg-green-50 border-green-200 text-green-900', // Green theme
};

const valueStyles: Record<CardVariant, string> = {
  default: 'text-foreground',
  critical: 'text-red-700',
  primary: 'text-blue-700',
  success: 'text-green-700',
};

const subtextStyles: Record<CardVariant, string> = {
  default: 'text-muted-foreground',
  critical: 'text-red-600/80',
  primary: 'text-blue-600/80',
  success: 'text-green-600/80',
};

export function StatCard({ 
  title, 
  value, 
  subtext, 
  variant = 'default', 
  className, 
  isLoading 
}: StatCardProps) {
  
  if (isLoading) {
    return (
      <div className={cn('rounded-xl border p-6 flex flex-col items-center justify-center space-y-3', className)}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-xl border p-6 flex flex-col items-center justify-center text-center transition-all duration-200 hover:shadow-md',
      variantStyles[variant],
      className
    )}>
      {/* Title */}
      <p className={cn("text-sm font-medium mb-2", subtextStyles[variant])}>
        {title}
      </p>

      {/* Main Value */}
      <h3 className={cn("text-2xl font-bold tracking-tight", valueStyles[variant])}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>

      {/* Subtext (The part in parentheses or below) */}
      {subtext && (
        <p className={cn("text-sm font-medium mt-1", subtextStyles[variant])}>
          {subtext}
        </p>
      )}
    </div>
  );
}