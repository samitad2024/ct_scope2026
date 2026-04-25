import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['federal_admin', 'regional_admin', 'zone_admin', 'woreda_admin', 'technician']),
  region: z.string().optional(),
  zone: z.string().optional(),
  woreda: z.string().optional(),
  phone: z.string().min(9, 'Phone number must be at least 9 characters'),
  password: z.string().min(6, 'Password is required for new accounts').default('TempPass123'),
  status: z.enum(['active', 'inactive']),
  latitude: z.coerce.number().default(9.03),
  longitude: z.coerce.number().default(38.7578),
});

export type UserFormData = z.infer<typeof userSchema>;
