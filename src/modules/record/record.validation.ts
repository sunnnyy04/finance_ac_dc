import { z } from "zod";

export const createRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive"),
    type: z.enum(["INCOME", "EXPENSE"]),
    category: z.string().min(1, "Category is required"),
    date: z.string().datetime().optional().default(() => new Date().toISOString()),
    notes: z.string().optional(),
  }),
});

export const updateRecordSchema = z.object({
  body: z.object({
    amount: z.number().positive("Amount must be positive").optional(),
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    category: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});
