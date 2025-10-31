"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController_1 = require("../controllers/quoteController");
const router = (0, express_1.Router)();
router.get('/quotes', quoteController_1.getQuotes);
router.get('/average', quoteController_1.getAverage);
router.get('/slippage', quoteController_1.getSlippageData);
exports.default = router;
//# sourceMappingURL=quoteRoutes.js.map