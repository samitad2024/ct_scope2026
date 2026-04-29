import React from 'react';
import { Form } from '../shared/Form';
import { userSchema, UserFormData } from '../../features/users/schema';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => void;
  isSubmitting?: boolean;
}

export function UserForm({ initialData, onSubmit, isSubmitting }: UserFormProps) {
  const defaultValues = {
    role: 'technician',
    status: 'active',
    latitude: 9.0192,
    longitude: 38.7525,
    ...initialData
  } as any;

  return (
    <Form
      schema={userSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? 'Update User' : 'Create User'}
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
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...methods.register('email')}
              placeholder="Enter email address"
            />
            {methods.formState.errors.email && (
              <p className="text-xs text-destructive">{methods.formState.errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              onValueChange={(value) => methods.setValue('role', value as any)}
              value={methods.watch('role') ?? ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="federal_admin">Federal Admin</SelectItem>
                <SelectItem value="regional_admin">Regional Admin</SelectItem>
                <SelectItem value="zone_admin">Zone Admin</SelectItem>
                <SelectItem value="city_admin">City Admin</SelectItem>
                <SelectItem value="woreda_admin">Woreda Admin</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
              </SelectContent>
            </Select>
            {methods.formState.errors.role && (
              <p className="text-xs text-destructive">{methods.formState.errors.role.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              {...methods.register('phone')}
              placeholder="Enter phone number"
            />
            {methods.formState.errors.phone && (
              <p className="text-xs text-destructive">{methods.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              {...methods.register('region')}
              placeholder="Enter region"
            />
            {methods.formState.errors.region && (
              <p className="text-xs text-destructive">{methods.formState.errors.region.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zone">Zone / Sub-city</Label>
              <Input
                id="zone"
                {...methods.register('zone')}
                placeholder="Enter zone"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="woreda">Woreda</Label>
              <Input
                id="woreda"
                {...methods.register('woreda')}
                placeholder="Enter woreda"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                {...methods.register('latitude')}
                placeholder="9.0192"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                {...methods.register('longitude')}
                placeholder="38.7525"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => methods.setValue('status', value as any)}
              value={methods.watch('status') ?? ''}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {methods.formState.errors.status && (
              <p className="text-xs text-destructive">{methods.formState.errors.status.message}</p>
            )}
          </div>
        </div>
      )}
    </Form>
  );
}
