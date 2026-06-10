import React from 'react';
import { cn } from '../../utils';

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, label, ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <button
          ref={ref}
          role="switch"
          aria-checked={checked}
          onClick={() => onCheckedChange(!checked)}
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
            checked ? 'bg-primary-600' : 'bg-gray-300',
            'focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            className
          )}
          {...props}
        >
          <span
            className={cn(
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </button>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
