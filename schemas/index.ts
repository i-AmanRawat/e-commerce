import * as z from "zod";

export const storeFormSchema = z.object({
  name: z.string().min(1, { message: "Enter store name" }),
});

export const settingsFormSchema = z.object({
  name: z.string().min(1, { message: "Enter store name" }),
});

export const billboardFormSchema = z.object({
  label: z.string().min(1, { message: "Enter store name" }),
  imageUrl: z.string().url(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, { message: "Enter category name" }),
  billboardId: z.string().min(1),
});

export const productFormSchema = z.object({
  name: z.string().min(1, { message: "Enter product name" }),
  images: z.object({ url: z.string().url() }).array(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  sizeId: z.string().min(1),
  colorId: z.string().min(1),
});

export const sizeFormSchema = z.object({
  name: z.string().min(1, { message: "Enter size name" }),
  value: z.string().min(1, { message: "Enter size value" }),
});

export const colorFormSchema = z.object({
  name: z.string().min(1, { message: "Enter color name" }),
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: "String must be a valid hex code" }),
});
