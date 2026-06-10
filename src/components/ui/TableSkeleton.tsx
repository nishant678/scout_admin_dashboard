import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-4 mb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className={`h-3 bg-gray-100 rounded flex-1 ${c === 0 ? 'w-1/4' : ''}`} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
