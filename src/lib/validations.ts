import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const productSchema = z.object({
  name: z.string().min(2),
  price: z.number().min(0),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const productUpdateSchema = z
  .object({
    name: z.string().min(2).optional(),
    price: z.number().min(0).optional(),
    image: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const orderSchema = z
  .object({
    name: z.string().min(2),
    phone: z.string().min(7),
    product: z.string().min(1).optional(),
    productId: z.string().min(1).optional(),
    quantity: z.number().min(1),
    address: z.string().min(5),
    notes: z.string().optional(),
    mediatorId: z.string().min(1),
  })
  .refine((data) => !!(data.product?.trim() || data.productId?.trim()), {
    message: "Product or productId is required",
  });

export const refundSchema = z.object({
  orderId: z.string().min(1),
  reason: z.string().min(3),
  amount: z.number().min(0),
  description: z.string().optional(),
});
