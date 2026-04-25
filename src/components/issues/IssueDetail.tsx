import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  AlertCircle, 
  MessageSquare, 
  History,
  Camera,
  ExternalLink,
  Send,
  Loader2
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useIssue } from '../../features/issues/hooks';

export default function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: issue, isLoading, error } = useIssue(id || '');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading issue details...</p>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Issue Not Found</h2>
        <p className="text-muted-foreground">The issue you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link to="/issues">Back to Issues</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
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
    if (!priority) return <Badge variant="outline">No Priority Set</Badge>;
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/issues"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{issue.title}</h1>
            <Badge variant="outline" className="font-mono">{issue.id}</Badge>
          </div>
          <p className="text-muted-foreground">Detailed view and management of infrastructure issue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Issue Information</CardTitle>
                <div className="flex gap-2">
                  {getPriorityBadge(issue.priority)}
                  {getStatusBadge(issue.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  "{issue.description}"
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Location Details
                  </h4>
                  <div className="space-y-1 text-sm border-l-2 border-primary/20 pl-3">
                    <p className="font-medium">{issue.address}</p>
                    <p className="text-muted-foreground">{issue.woreda_name}, {issue.zone_name}</p>
                    <p className="text-muted-foreground">{issue.region_name}, Ethiopia</p>
                    <p className="text-[10px] text-muted-foreground pt-1">
                      GPS: {issue.latitude}, {issue.longitude}
                    </p>
                    <Button variant="link" className="p-0 h-auto text-xs" asChild>
                      <a href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`} target="_blank" rel="noreferrer">
                        View on Google Maps <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" /> Reporter Details
                  </h4>
                  <div className="space-y-2 text-sm border-l-2 border-primary/20 pl-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">{issue.reporter_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{issue.reporter_name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">Status: Registered Citizen</p>
                    <p className="text-xs text-muted-foreground">Reported At: {new Date(issue.reported_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {issue.image_url && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Camera className="h-4 w-4" /> Evidence & Photos
                    </h4>
                    <div className="aspect-video w-full max-w-xl rounded-lg overflow-hidden border bg-muted shadow-inner">
                      <img 
                        src={issue.image_url} 
                        alt="Evidence" 
                        className="object-cover w-full h-full" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Discussion & Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                No internal comments yet. Be the first to start the discussion.
              </div>
              <div className="flex gap-2 pt-2">
                <Input placeholder="Write a note to other admins..." className="flex-1" />
                <Button size="icon"><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {issue.assigned_technician ? (
                <div className="flex items-center gap-3 rounded-lg border p-3 bg-primary/5 border-primary/20">
                  <Avatar>
                    <AvatarFallback>{issue.assigned_technician.full_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.assigned_technician.full_name}</p>
                    <p className="text-xs text-muted-foreground">Assigned Technician</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Phone: {issue.assigned_technician.phone}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 border-2 border-dashed rounded-lg text-center space-y-3">
                  <p className="text-sm text-muted-foreground font-medium">Currently Unassigned</p>
                  <Button className="w-full" size="sm">Select Personnel</Button>
                </div>
              )}
              <Button variant="outline" className="w-full">Update Workflow Status</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="h-5 w-5" /> Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Community Votes</span>
                <span className="font-bold text-primary">{issue.votes}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Response Tier</span>
                <Badge variant="outline" className="capitalize">{issue.category}</Badge>
              </div>
              <Separator />
              <div className="text-[10px] text-muted-foreground italic text-center">
                Last integrity check: {new Date().toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
