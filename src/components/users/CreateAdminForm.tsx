import React from 'react';
import { Form } from '../shared/Form';
import { createAdminSchema, CreateAdminFormData } from '../../features/users/schema';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAuthStore } from '../../hooks/useAuth';
import { UserRole } from '../../types/api';

interface CreateAdminFormProps {
  onSubmit: (data: CreateAdminFormData) => void;
  isSubmitting?: boolean;
}

export function CreateAdminForm({ onSubmit, isSubmitting }: CreateAdminFormProps) {
  const { user } = useAuthStore();
  
  const getAvailableRoles = (currentRole: UserRole | undefined): { value: string; label: string }[] => {
    switch (currentRole) {
      case 'federal_admin':
        return [{ value: 'regional_admin', label: 'Regional Admin' }];
      case 'regional_admin':
        return [{ value: 'zone_admin', label: 'Zone Admin' }];
      case 'zone_admin':
        return [{ value: 'city_admin', label: 'City Admin' }];
      case 'city_admin':
        return [{ value: 'woreda_admin', label: 'Woreda Admin' }];
      default:
        return [];
    }
  };

  const availableRoles = getAvailableRoles(user?.role);
  
  const defaultValues: Partial<CreateAdminFormData> = {
    role: availableRoles[0]?.value as any,
    latitude: 9.03,
    longitude: 38.7578,
  };

  return (
    <Form
      schema={createAdminSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Create Hierarchical Admin"
    >
      {(methods) => (
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...methods.register('name')}
              placeholder="Enter full name"
            />
            {methods.formState.errors.name && (
              <p className="text-xs text-destructive">{methods.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              {...methods.register('phone_number')}
              placeholder="+2519..."
            />
            {methods.formState.errors.phone_number && (
              <p className="text-xs text-destructive">{methods.formState.errors.phone_number.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              type="password"
              {...methods.register('password')}
              placeholder="Enter temporary password"
            />
            {methods.formState.errors.password && (
              <p className="text-xs text-destructive">{methods.formState.errors.password.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role (Based on Hierarchy)</Label>
            <Select
              onValueChange={(value) => methods.setValue('role', value as any)}
              value={methods.watch('role') ?? ''}
              disabled={availableRoles.length <= 1}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subordinate role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">
              As a {user?.role?.replace('_', ' ')}, you can create {availableRoles.map(r => r.label).join(', ')} accounts.
            </p>
            {methods.formState.errors.role && (
              <p className="text-xs text-destructive">{methods.formState.errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="latitude">Latitude (For Assignment)</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                {...methods.register('latitude')}
                placeholder="9.03"
              />
              {methods.formState.errors.latitude && (
                <p className="text-xs text-destructive">{methods.formState.errors.latitude.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">Longitude (For Assignment)</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                {...methods.register('longitude')}
                placeholder="38.7578"
              />
              {methods.formState.errors.longitude && (
                <p className="text-xs text-destructive">{methods.formState.errors.longitude.message}</p>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            * Note: Administrative unit (Region/Zone/Woreda) will be automatically assigned by the backend based on these coordinates.
          </p>
        </div>
      )}
    </Form>
  );
}
