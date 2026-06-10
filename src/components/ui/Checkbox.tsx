import React from 'react';
import { cn } from '../../utils';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            'w-4 h-4 border border-gray-300 rounded transition-colors duration-200',
            'checked:bg-primary-600 checked:border-primary-600',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {label && (
          <label className="text-sm font-medium text-gray-700 cursor-pointer">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
