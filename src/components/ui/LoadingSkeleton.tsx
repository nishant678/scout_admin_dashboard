import React from 'react';
import { cn } from '../../utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  height?: string;
  width?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  height = 'h-4',
  width = 'w-full',
  className,
  ...props
}) => {
  return (
    <div className="space-y-2" {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-gray-200 rounded animate-pulse',
            height,
            width,
            className
          )}
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
