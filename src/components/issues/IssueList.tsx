import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User as UserIcon,
  ArrowUpRight,
  Check,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '../ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Link } from 'react-router-dom';
import { useIssues, useAssignIssue } from '../../features/issues/hooks';
import { useUsers } from '../../features/users/hooks';
import { Skeleton } from '../ui/skeleton';
import { Issue } from '../../types/api';
import { toast } from 'sonner';

export default function IssueManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string | null>(null);

  const { data, isLoading } = useIssues({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page: 1,
    limit: 50
  });

  const { data: technicians = [], isLoading: techsLoading } = useUsers();
  const assignMutation = useAssignIssue();

  const issues = data?.issues ?? [];

  const handleAssign = async () => {
    if (!selectedTechnicianId || !selectedIssue) return;

    try {
      await assignMutation.mutateAsync({ 
        issueId: selectedIssue.id, 
        technicianId: selectedTechnicianId 
      });
      toast.success('Technician assigned successfully');
      setIsAssignModalOpen(false);
      // Update selected issue locally to reflect change in sheet if needed, 
      // but query invalidation should handle it on refocus/next open
    } catch (err) {
      toast.error('Failed to assign technician');
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         issue.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: Issue['status']) => {
    switch (status) {
      case 'reported': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reported</Badge>;
      case 'verified': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Verified</Badge>;
      case 'assigned': return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Assigned</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Progress</Badge>;
      case 'resolved': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string | null) => {
    if (!priority) return <Badge variant="outline">N/A</Badge>;
    switch (priority.toLowerCase()) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'high': return <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium': return <Badge variant="secondary">Medium</Badge>;
      case 'low': return <Badge variant="outline">Low</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Issue Management</h1>
          <p className="text-muted-foreground">Manage and track civic infrastructure issues across all tiers.</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Report New Issue
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or title..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Issue Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Votes</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map(i => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-10 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredIssues.length > 0 ? (
              filteredIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-mono text-xs font-bold truncate max-w-[80px]">{issue.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{issue.title}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {issue.woreda_name}, {issue.zone_name}, {issue.region_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{issue.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {issue.assigned_technician ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-[8px]">{issue.assigned_technician.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium truncate max-w-[100px]">{issue.assigned_technician.full_name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(issue.status)}</TableCell>
                  <TableCell className="text-xs font-medium">{issue.votes}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(issue.reported_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setSelectedIssue(issue)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-[540px]">
                          {selectedIssue && (
                            <div className="h-full flex flex-col">
                              <SheetHeader>
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="font-mono">{selectedIssue.id}</Badge>
                                  {getPriorityBadge(selectedIssue.priority)}
                                </div>
                                <SheetTitle className="text-2xl">{selectedIssue.title}</SheetTitle>
                                <SheetDescription>
                                  Reported on {new Date(selectedIssue.reported_at).toLocaleString()}
                                </SheetDescription>
                              </SheetHeader>
                              
                              <ScrollArea className="flex-1 mt-6 pr-4">
                                <div className="space-y-6">
                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <AlertCircle className="h-4 w-4" /> Description
                                    </h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {selectedIssue.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground">Status</p>
                                      {getStatusBadge(selectedIssue.status)}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-xs text-muted-foreground">Category</p>
                                      <Badge variant="secondary" className="capitalize">{selectedIssue.category}</Badge>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <MapPin className="h-4 w-4" /> Location
                                    </h4>
                                    <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                                      <p className="font-medium">{selectedIssue.address}</p>
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {selectedIssue.woreda_name}, {selectedIssue.zone_name}, {selectedIssue.region_name}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground mt-1">
                                        (Lat: {selectedIssue.latitude}, Lng: {selectedIssue.longitude})
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <h4 className="text-sm font-semibold flex items-center gap-2">
                                      <UserIcon className="h-4 w-4" /> Reporter
                                    </h4>
                                    <div className="flex items-center gap-3 rounded-lg border p-3">
                                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {selectedIssue.reporter_name?.charAt(0) || 'R'}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{selectedIssue.reporter_name}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedIssue.assigned_technician && (
                                    <div className="space-y-2">
                                      <h4 className="text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" /> Assigned Personnel
                                      </h4>
                                      <div className="flex items-center gap-3 rounded-lg border p-3 bg-green-50/50">
                                        <Avatar className="h-8 w-8">
                                          <AvatarFallback>{selectedIssue.assigned_technician.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <p className="text-sm font-medium">{selectedIssue.assigned_technician.full_name}</p>
                                          <p className="text-xs text-muted-foreground">{selectedIssue.assigned_technician.phone}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </ScrollArea>

                              <SheetFooter className="mt-6 pt-6 border-t gap-2 sm:gap-0">
                                <Button variant="outline" className="flex-1" asChild>
                                  <Link to={`/issues/${selectedIssue.id}`}>Full Details</Link>
                                </Button>
                                
                                <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                                  <DialogTrigger asChild>
                                    <Button className="flex-1" disabled={!!selectedIssue.assigned_to}>
                                      {selectedIssue.assigned_to ? 'Already Assigned' : 'Assign Technician'}
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                      <DialogTitle>Assign Technician</DialogTitle>
                                      <DialogDescription>
                                        Select a technician to handle this infrastructure issue.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="max-h-[300px] overflow-y-auto space-y-2 py-4">
                                      {techsLoading ? (
                                        <div className="flex justify-center p-4"><Loader2 className="animate-spin h-6 w-6" /></div>
                                      ) : technicians.map((tech) => (
                                        <div 
                                          key={tech.id}
                                          onClick={() => setSelectedTechnicianId(tech.id)}
                                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-muted transition-colors ${selectedTechnicianId === tech.id ? 'border-primary bg-primary/5' : ''}`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                              <AvatarFallback>{tech.full_name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                              <p className="text-sm font-medium">{tech.full_name}</p>
                                              <p className="text-xs text-muted-foreground">{tech.phone}</p>
                                            </div>
                                          </div>
                                          {selectedTechnicianId === tech.id && <Check className="h-4 w-4 text-primary" />}
                                        </div>
                                      ))}
                                    </div>
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>Cancel</Button>
                                      <Button 
                                        onClick={handleAssign} 
                                        disabled={!selectedTechnicianId || assignMutation.isPending}
                                      >
                                        {assignMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Confirm Assignment
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </SheetFooter>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link to={`/issues/${issue.id}`}><Eye className="mr-2 h-4 w-4" /> View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Issue
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Resolved
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground text-sm">
                  No issues found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
