import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockChartData } from '../../services/mock';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Link } from 'react-router-dom';
import { useDashboardStats, usePendingIssues } from '../../features/dashboard/hooks';
import { Skeleton } from '../ui/skeleton';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: pendingData, isLoading: issuesLoading } = usePendingIssues({ limit: 5 });

  const statsItems = [
    { label: 'Total Issues', value: stats?.total ?? 0, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Pending Issues', value: stats?.pending ?? 0, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'In Progress', value: stats?.in_progress ?? 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Completed', value: stats?.completed ?? 0, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
  ];

  const statusData = [
    { name: 'Pending', value: stats?.pending ?? 0, color: '#ef4444' },
    { name: 'In Progress', value: stats?.in_progress ?? 0, color: '#f59e0b' },
    { name: 'Completed', value: stats?.completed ?? 0, color: '#10b981' },
  ];

  const categoryData = [
    { name: 'Road', value: 40, color: '#3b82f6' },
    { name: 'Water', value: 30, color: '#0ea5e9' },
    { name: 'Electricity', value: 20, color: '#eab308' },
    { name: 'Garbage', value: 10, color: '#f97316' },
    { name: 'Drainage', value: 5, color: '#8b5cf6' },
  ];

  if (statsError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-6 text-destructive">
        <div className="text-center">
          <AlertCircle className="mx-auto h-10 w-10 mb-2" />
          <h2 className="text-lg font-semibold">Failed to load dashboard data</h2>
          <p className="text-sm">{(statsError as Error).message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">National Multi-Tier Civic Intelligence Platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Live Feed
          </Button>
          <Button size="sm">
            Download Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-20 mt-1" />
                  ) : (
                    <h3 className="text-2xl font-bold">{stat.value.toLocaleString()}</h3>
                  )}
                </div>
                <div className={`rounded-full p-2 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-green-500">
                <TrendingUp className="h-3 w-3" />
                <span>Computed from unit boundaries</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Issue Trends</CardTitle>
            <CardDescription>System-wide report tracking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="issues" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorIssues)" />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
            <CardDescription>Resource allocation by state.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {statsLoading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="relative size-32 rounded-full border-8 border-muted" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Issues by Category</CardTitle>
            <CardDescription>Infrastructure types distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>High Priority Pending</CardTitle>
              <CardDescription>Latest infrastructure issues requiring attention.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/issues">View All <ArrowUpRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {issuesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingData?.issues?.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{issue.title}</span>
                          <span className="text-xs text-muted-foreground">{issue.address}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {issue.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] capitalize">
                          {issue.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="xs" variant="ghost" asChild>
                          <Link to={`/issues/${issue.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!pendingData?.issues || pendingData.issues.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No pending issues found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
