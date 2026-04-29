import React, { useState } from 'react';
import { 
  useTechnicianTasks, 
  useAcceptTask, 
  useStartTask, 
  useCompleteTask 
} from '../../features/technician/hooks';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Loader2, 
  ClipboardCheck, 
  Play, 
  CheckCircle, 
  Clock, 
  MapPin,
  AlertTriangle,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function TaskList() {
  const { data: tasks = [], isLoading, error } = useTechnicianTasks();
  const acceptMutation = useAcceptTask();
  const startMutation = useStartTask();
  const completeMutation = useCompleteTask();

  const handleAction = async (action: 'accept' | 'start' | 'complete', taskId: string) => {
    try {
      if (action === 'accept') await acceptMutation.mutateAsync(taskId);
      if (action === 'start') await startMutation.mutateAsync(taskId);
      if (action === 'complete') await completeMutation.mutateAsync(taskId);
      toast.success(`Task ${action}ed successfully`);
    } catch (err) {
      toast.error(`Failed to ${action} task`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
        <h2 className="text-xl font-bold">Error loading tasks</h2>
        <p>{(error as any).message}</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const activeTasks = tasks.filter(t => t.status === 'accepted' || t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const TaskCard = ({ task }: { task: any, key?: string }) => (
    <Card className="overflow-hidden border-l-4" style={{ 
      borderLeftColor: task.status === 'pending' ? '#ef4444' : 
                       task.status === 'in_progress' ? '#f59e0b' : 
                       task.status === 'accepted' ? '#3b82f6' : '#10b981' 
    }}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="font-mono text-[10px]">
            {task.issue_number || task.id.substring(0, 8)}
          </Badge>
          <Badge className="capitalize text-[10px]">
            {task.status.replace('_', ' ')}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="truncate">{task.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="capitalize">{task.category}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Assigned: {new Date(task.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t bg-muted/20 gap-2">
        {task.status === 'pending' && (
          <Button 
            className="w-full" 
            size="sm" 
            onClick={() => handleAction('accept', task.id)}
            disabled={acceptMutation.isPending}
          >
            <ClipboardCheck className="mr-2 h-4 w-4" /> Accept Task
          </Button>
        )}
        {task.status === 'accepted' && (
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            size="sm" 
            onClick={() => handleAction('start', task.id)}
            disabled={startMutation.isPending}
          >
            <Play className="mr-2 h-4 w-4" /> Start Work
          </Button>
        )}
        {task.status === 'in_progress' && (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            size="sm" 
            onClick={() => handleAction('complete', task.id)}
            disabled={completeMutation.isPending}
          >
            <CheckCircle className="mr-2 h-4 w-4" /> Mark Complete
          </Button>
        )}
        {task.status === 'completed' && (
          <div className="w-full py-1 text-center text-xs font-medium text-green-600 flex items-center justify-center gap-1">
            <CheckCircle className="h-3 w-3" /> Completed on {task.completed_at ? new Date(task.completed_at).toLocaleDateString() : 'recent'}
          </div>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Technician Tasks</h1>
        <p className="text-muted-foreground">Manage your infrastructure repair assignments.</p>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="available">Available ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="history">History ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="mt-6">
          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
              <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No new tasks</h3>
              <p className="text-muted-foreground">Check back later for new assignments.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
           {activeTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
              <Play className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No active tasks</h3>
              <p className="text-muted-foreground">Select an available task to start working.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {completedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
              <History className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium">No history</h3>
              <p className="text-muted-foreground">Completed tasks will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
