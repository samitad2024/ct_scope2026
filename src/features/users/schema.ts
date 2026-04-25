import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['federal_admin', 'regional_admin', 'zone_admin', 'woreda_admin', 'technician']),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  phone: z.string().min(9, 'Phone number must be at least 9 characters'),
  status: z.enum(['active', 'inactive']),
  latitude: z.coerce.number().default(9.0192),
  longitude: z.coerce.number().default(38.7525),
});

export type UserFormData = z.infer<typeof userSchema>;
