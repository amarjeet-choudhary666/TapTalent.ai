import { z } from 'zod';

export const quoteSchema = z.object({
  buyPrice: z.number().positive('Buy price must be positive'),
  sellPrice: z.number().positive('Sell price must be positive'),
  source: z.string(),
  currency: z.enum(['ARS', 'BRL'])
});

export const averageSchema = z.object({
  averageBuyPrice: z.number().positive('Average buy price must be positive'),
  averageSellPrice: z.number().positive('Average sell price must be positive')
});

export const slippageSchema = z.object({
  buyPriceSlippage: z.number(),
  sellPriceSlippage: z.number(),
  source: z.string()
});

export type Quote = z.infer<typeof quoteSchema>;
export type Average = z.infer<typeof averageSchema>;
export type Slippage = z.infer<typeof slippageSchema>;