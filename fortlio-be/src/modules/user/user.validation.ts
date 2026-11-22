import { z } from '../../validations/zod';
import { IdValidation } from '../../validations/common-validation';

export const UserIdValidation = IdValidation('userId');
export const MobileNumberValidation = z.string().trim().length(12, { message: 'Mobile number must be 12 digits' });

export const UserCreateValidation = z.object({
  fullName: z.string().trim().min(1, { message: 'First name is required' }).max(50, { message: 'First name must be less than 50 characters' }).transform(val => val.replace(/\s+/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ')),
  mobileNumber: MobileNumberValidation,
  email: z.email('Invalid email address').max(100, 'Email must be less than 100 characters').or(z.literal('')).optional(),
  roleId: IdValidation('roleId').optional(),
  status: z.boolean({ message: 'Status is required' }).optional(),
});

export const UserUpdateValidation = z.object({
  userId: UserIdValidation,
  fullName: z.string().trim().min(1, { message: 'First name is required' }).max(50, { message: 'First name must be less than 50 characters' }).optional().transform(val => {
    if (!val) { return undefined; }
    return val.replace(/\s+/g, ' ').split(' ').map(word => word[0].toUpperCase() + word.substring(1).toLowerCase()).join(' ');
  }),
  mobileNumber: MobileNumberValidation.optional(),
  email: z.email('Invalid email address').max(100, 'Email must be less than 100 characters').or(z.literal('')).optional(),
  roleId: IdValidation('roleId').optional(),
  status: z.boolean({ message: 'Status is required' }).optional(),
});

export const UserStatusUpdate = z.object({
  userId: UserIdValidation,
  status: z.boolean({ message: 'Status is required' }),
});

export const CreditCardPaymentValidation = z.object({
  cardNumber: z.string().trim().min(13, { message: 'Card number must be at least 13 digits' }).max(19, { message: 'Card number must be at most 19 digits' }),
  expMonth: z.number().int().min(1).max(12),
  expYear: z.number().int().min(2024),
  cvc: z.string().trim().min(3, { message: 'CVC must be 3 or 4 digits' }).max(4, { message: 'CVC must be 3 or 4 digits' }),
  cardholderName: z.string().trim().min(1, { message: 'Cardholder name is required' }).max(100),
  plan: z.string().optional(),
  coinPackageId: z.string().optional(),
  coins: z.number().int().positive().optional(),
  amountPaid: z.number().positive({ message: 'Amount paid must be greater than zero' }),
});

export const ToggleAiOptInValidation = z.object({
  isAiOptedIn: z.boolean(),
});

