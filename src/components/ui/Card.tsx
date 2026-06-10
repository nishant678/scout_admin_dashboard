import React from 'react';
import { cn } from '../../utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-white border border-gray-200 shadow-sm',
      glass: 'bg-white/30 backdrop-blur-md border border-white/20 shadow-lg',
      elevated: 'bg-white shadow-lg border-0',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl p-6 transition-shadow duration-200 hover:shadow-md',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
