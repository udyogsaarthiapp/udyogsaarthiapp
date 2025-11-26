import React from 'react';
import { clsx } from 'clsx';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        {
          'bg-blue-600 text-white': variant === 'default',
          'bg-gray-100 text-gray-900': variant === 'secondary',
          'bg-red-600 text-white': variant === 'destructive',
          'border border-gray-300 text-gray-900': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };