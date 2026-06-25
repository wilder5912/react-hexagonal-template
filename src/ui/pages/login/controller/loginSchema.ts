import { z } from 'zod';

/** Validation schema for the login form. */
export const loginSchema = z.object({
  username: z.string().trim().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

/** Form values inferred from the schema. */
export type LoginFormValues = z.infer<typeof loginSchema>;
