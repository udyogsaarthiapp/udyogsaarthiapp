import React from 'react';
import { clsx } from 'clsx';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    
    return (
      <Comp
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'focus-visible-enhanced',
          
          // Variant styles
          {
            // Default variant
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800': variant === 'default',
            
            // Destructive variant
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800': variant === 'destructive',
            
            // Outline variant
            'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100': variant === 'outline',
            
            // Secondary variant
            'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300': variant === 'secondary',
            
            // Ghost variant
            'text-gray-900 hover:bg-gray-100 active:bg-gray-200': variant === 'ghost',
            
            // Link variant
            'text-blue-600 underline-offset-4 hover:underline': variant === 'link',
          },
          
          // Size styles
          {
            'h-10 px-4 py-2': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-6 text-base': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };