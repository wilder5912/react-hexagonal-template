import { z } from 'zod';

/**
 * Validation schema for the product form (create/edit).
 * Mirrors `ProductDraft` from the products module, but adds the UI rules
 * (required title, non-negative numbers) that the form must enforce.
 */
export const productSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  // The inputs use `valueAsNumber` (in the page), so these arrive as real numbers.
  // `NaN` happens when the field is left empty, so we give a friendly message for it.
  price: z
    .number({ message: 'Price is required' })
    .min(0, 'Price must be 0 or greater'),
  category: z.string().trim().min(1, 'Category is required'),
  stock: z
    .number({ message: 'Stock is required' })
    .int('Stock must be a whole number')
    .min(0, 'Stock must be 0 or greater'),
});

/** Form values inferred from the schema. */
export type ProductFormValues = z.infer<typeof productSchema>;
