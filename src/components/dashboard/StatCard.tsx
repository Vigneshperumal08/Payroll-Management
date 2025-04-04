
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start">
        <div className="stat-label">{title}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className="flex items-center text-sm">
          <span className={trend.isPositive ? "text-green-500" : "text-red-500"}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-muted-foreground ml-2">vs last month</span>
        </div>
      )}
    </div>
  );
}
