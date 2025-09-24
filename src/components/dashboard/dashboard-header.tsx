import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Calendar,
  Leaf,
  Recycle,
  CheckCircle,
  Clock
} from "lucide-react";
import type { DashboardStats } from "../../lib/types";
import { cn } from "../../lib/utils";

interface DashboardHeaderProps {
  stats: DashboardStats;
  loading?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

function MetricCard({ title, value, icon: Icon, trend, className, iconClassName }: MetricCardProps) {
  return (
    <Card className={cn("relative overflow-hidden group hover:shadow-lg transition-all duration-300", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {trend && (
              <div className="flex items-center space-x-1">
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-xs sm:text-sm font-medium",
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn(
            "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3",
            iconClassName
          )}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardHeader({ stats, loading = false }: DashboardHeaderProps) {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-80 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-96 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex space-x-2">
              <div className="h-10 w-24 bg-muted animate-pulse rounded-lg" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
            </div>
          </div>
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-8 w-20 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                  <div className="h-12 w-12 bg-muted rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Carbon Credits Overview
            </h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 w-fit">
              Live
            </Badge>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Monitor your environmental impact and carbon offset portfolio in real-time. 
            Track credits, analyze trends, and manage your sustainability goals.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
            <Activity className="h-3 w-3 mr-1" />
            System Active
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Updated 2m ago
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Credits"
          value={stats.totalCredits}
          icon={Leaf}
          trend={{ value: 12.5, isPositive: true }}
          iconClassName="from-blue-500 to-blue-600"
        />
        
        <MetricCard
          title="Active Credits"
          value={stats.activeCredits}
          icon={CheckCircle}
          trend={{ value: 8.2, isPositive: true }}
          iconClassName="from-green-500 to-green-600"
        />
        
        <MetricCard
          title="Retired Credits"
          value={stats.retiredCredits}
          icon={Recycle}
          trend={{ value: 15.3, isPositive: true }}
          iconClassName="from-orange-500 to-orange-600"
        />
        
        <MetricCard
          title="Vintage Range"
          value={stats.vintageRange.min === stats.vintageRange.max 
            ? stats.vintageRange.min 
            : `${stats.vintageRange.min}-${stats.vintageRange.max}`}
          icon={Calendar}
          iconClassName="from-purple-500 to-purple-600"
        />
      </div>

      {/* Quick Stats Bar */}
      <Card className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Portfolio Growth</p>
                <p className="text-base sm:text-lg font-bold text-primary">+24.5% YTD</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">CO₂ Offset</p>
                <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                  {(stats.totalCredits * 1.2).toLocaleString()} tons
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 sm:col-span-2 lg:col-span-1">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Projects</p>
                <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                  {Math.ceil(stats.totalCredits / 100)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}