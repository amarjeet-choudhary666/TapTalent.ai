"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlippageData = exports.getAverage = exports.getQuotes = void 0;
const quoteService_1 = require("../services/quoteService");
const quoteValidation_1 = require("../validation/quoteValidation");
const getQuotes = async (_req, res) => {
    try {
        if (await (0, quoteService_1.shouldFetchNewData)()) {
            await (0, quoteService_1.fetchAllQuotes)();
        }
        const quotes = await (0, quoteService_1.getQuotesFromDB)();
        // Validate quotes with Zod
        const validatedQuotes = quotes.map(quote => quoteValidation_1.quoteSchema.parse(quote));
        res.json(validatedQuotes);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch quotes' });
    }
};
exports.getQuotes = getQuotes;
const getAverage = async (_req, res) => {
    try {
        if (await (0, quoteService_1.shouldFetchNewData)()) {
            await (0, quoteService_1.fetchAllQuotes)();
        }
        const average = await (0, quoteService_1.getAveragePrices)();
        // Validate average with Zod
        const validatedAverage = quoteValidation_1.averageSchema.parse(average);
        res.json(validatedAverage);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate average' });
    }
};
exports.getAverage = getAverage;
const getSlippageData = async (_req, res) => {
    try {
        if (await (0, quoteService_1.shouldFetchNewData)()) {
            await (0, quoteService_1.fetchAllQuotes)();
        }
        const slippage = await (0, quoteService_1.getSlippage)();
        // Validate slippage with Zod
        const validatedSlippage = slippage.map(item => quoteValidation_1.slippageSchema.parse(item));
        res.json(validatedSlippage);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate slippage' });
    }
};
exports.getSlippageData = getSlippageData;
//# sourceMappingURL=quoteController.js.map