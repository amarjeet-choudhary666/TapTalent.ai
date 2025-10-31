import { Request, Response } from 'express';
import { fetchAllQuotes, getQuotesFromDB, getAveragePrices, getSlippage, shouldFetchNewData } from '../services/quoteService';
import { quoteSchema, averageSchema, slippageSchema } from '../validation/quoteValidation';

export const getQuotes = async (_req: Request, res: Response) => {
  try {
    if (await shouldFetchNewData()) {
      await fetchAllQuotes();
    }

    const quotes = await getQuotesFromDB();

    // Validate quotes with Zod
    const validatedQuotes = quotes.map(quote => quoteSchema.parse(quote));

    res.json(validatedQuotes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

export const getAverage = async (_req: Request, res: Response) => {
  try {
    if (await shouldFetchNewData()) {
      await fetchAllQuotes();
    }

    const average = await getAveragePrices();

    // Validate average with Zod
    const validatedAverage = averageSchema.parse(average);

    res.json(validatedAverage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate average' });
  }
};

export const getSlippageData = async (_req: Request, res: Response) => {
  try {
    if (await shouldFetchNewData()) {
      await fetchAllQuotes();
    }

    const slippage = await getSlippage();

    // Validate slippage with Zod
    const validatedSlippage = slippage.map(item => slippageSchema.parse(item));

    res.json(validatedSlippage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate slippage' });
  }
};