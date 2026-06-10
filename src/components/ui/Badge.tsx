import React from 'react';
import { cn } from '../../utils';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status' | 'priority' | 'outline';
  status?: keyof typeof STATUS_COLORS;
  priority?: keyof typeof PRIORITY_COLORS;
  children: React.ReactNode;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      status,
      priority,
      children,
      ...props
    },
    ref
  ) => {
    let styles = '';

    if (variant === 'status' && status) {
      const statusColor = STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS];
      styles = statusColor ? `${statusColor.badge} ${statusColor.text}` : 'bg-gray-100 text-gray-800';
    } else if (variant === 'priority' && priority) {
      styles = PRIORITY_COLORS[priority];
    } else if (variant === 'outline') {
      styles = 'bg-transparent border border-gray-300 text-gray-700';
    } else {
      styles = 'bg-gray-100 text-gray-800';
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
          styles,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
