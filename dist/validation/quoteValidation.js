"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slippageSchema = exports.averageSchema = exports.quoteSchema = void 0;
const zod_1 = require("zod");
exports.quoteSchema = zod_1.z.object({
    buyPrice: zod_1.z.number().positive('Buy price must be positive'),
    sellPrice: zod_1.z.number().positive('Sell price must be positive'),
    source: zod_1.z.string(),
    currency: zod_1.z.enum(['ARS', 'BRL'])
});
exports.averageSchema = zod_1.z.object({
    averageBuyPrice: zod_1.z.number().positive('Average buy price must be positive'),
    averageSellPrice: zod_1.z.number().positive('Average sell price must be positive')
});
exports.slippageSchema = zod_1.z.object({
    buyPriceSlippage: zod_1.z.number(),
    sellPriceSlippage: zod_1.z.number(),
    source: zod_1.z.string()
});
//# sourceMappingURL=quoteValidation.js.map