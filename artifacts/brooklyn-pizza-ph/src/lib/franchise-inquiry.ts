import { z } from 'zod';

export const franchiseInquirySchema = z
  .object({
    firstName: z.string().trim().min(1, 'Please enter your first name.').max(80),
    lastName: z.string().trim().min(1, 'Please enter your last name.').max(80),
    email: z.string().trim().email('Please enter a valid email address.').max(254),
    capital: z.enum(['0–500k', '501k–1 million', '1 million–2+ million'], {
      required_error: 'Please choose a capital range.',
    }),
    location: z.string().trim().min(1, 'Please tell us where you want to open a shop.').max(160),
    website: z.string().max(200).optional().default(''),
  })
  .strict();

export type FranchiseInquiryValues = z.infer<typeof franchiseInquirySchema>;
