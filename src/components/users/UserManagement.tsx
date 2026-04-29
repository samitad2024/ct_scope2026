import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Shield, 
  Mail, 
  MapPin,
  CheckCircle2,
  XCircle,
  Activity
} from 'lucide-react';
import { useUsers, useCreateUser, useUpdateUser } from '../../features/users/hooks';
import { User, UserRole, Technician, CreateAdminRequest } from '../../types/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
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
import { Modal } from '../shared/Modal';
import { UserForm } from './UserForm';
import { CreateAdminForm } from './CreateAdminForm';
import { UserFormData, CreateAdminFormData } from '../../features/users/schema';
import { toast } from 'sonner';

export default function UserManagement() {
  const { data: users = [], isLoading } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleCreateHierarchicalAdmin = async (data: CreateAdminFormData) => {
    try {
      await createUserMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      toast.success('Hierarchical admin created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create admin');
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;
    try {
      // Map to the fields the backend expects for an update
      const updatePayload = {
        full_name: data.name,
        phone: data.phone,
        role: data.role,
        is_active: data.status === 'active'
      };
      await updateUserMutation.mutateAsync({ id: editingUser.id, user: updatePayload as any });
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'federal_admin': return <Badge className="bg-red-500 hover:bg-red-600">Federal Admin</Badge>;
      case 'regional_admin': return <Badge className="bg-blue-500 hover:bg-blue-600">Regional Admin</Badge>;
      case 'zone_admin': return <Badge className="bg-purple-500 hover:bg-purple-600">Zone Admin</Badge>;
      case 'city_admin': return <Badge className="bg-amber-500 hover:bg-amber-600">City Admin</Badge>;
      case 'woreda_admin': return <Badge className="bg-orange-500 hover:bg-orange-600">Woreda Admin</Badge>;
      case 'technician': return <Badge className="bg-green-500 hover:bg-green-600">Technician</Badge>;
      case 'citizen': return <Badge variant="secondary">Citizen</Badge>;
      default: return <Badge variant="outline" className="capitalize">{role}</Badge>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading personnel data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel Management</h1>
          <p className="text-muted-foreground">Manage administrative access and field officers across the platform.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add New Admin
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search personnel by name..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="h-9 px-4">Total: {users.length}</Badge>
          <Badge variant="outline" className="h-9 px-4">Active: {(users as Technician[]).filter(u => u.is_active).length}</Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Personnel</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Workload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users as any[]).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.full_name}</span>
                      <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">{user.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>
                <TableCell className="text-sm">
                  {user.phone}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <span>{user.active_assignments} Active Tasks</span>
                  </div>
                </TableCell>
                <TableCell>
                  {user.is_active ? (
                    <div className="flex items-center gap-1 text-green-500 text-xs font-medium">
                      <CheckCircle2 className="h-3 w-3" /> Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-500 text-xs font-medium">
                      <XCircle className="h-3 w-3" /> Inactive
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
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
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Shield className="mr-2 h-4 w-4" /> Edit Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" /> Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No personnel found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Hierarchical Admin"
        description="Create a new administrative user. You can only create roles directly below your level in the hierarchy."
      >
        <CreateAdminForm
          onSubmit={handleCreateHierarchicalAdmin}
          isSubmitting={createUserMutation.isPending}
        />
      </Modal>

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit Personnel"
        description="Update personnel information and permissions."
      >
        {editingUser && (
          <UserForm
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            isSubmitting={updateUserMutation.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
