import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../utils';
import { formatNumber } from '../../utils/formatters';

interface AnalyticsCardProps {
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  bgColor?: string;
  delay?: number;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  bgColor = 'bg-primary-50',
}) => {
  const isPositive = trend === 'up';

  return (
      <Card className={cn('cursor-pointer group', bgColor)}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">
              {formatNumber(value)}
            </h3>
          </div>
          <div className="p-3 rounded-lg bg-white/60 group-hover:bg-white transition-colors duration-200">
            {icon}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {change > 0 ? '+' : ''}{formatNumber(change)}
          </span>
          <span className="text-sm text-gray-500">This week</span>
        </div>

        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 w-full" />
        </div>
      </Card>
  );
};

export default AnalyticsCard;
