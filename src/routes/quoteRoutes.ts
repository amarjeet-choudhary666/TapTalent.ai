import { Router } from 'express';
import { getQuotes, getAverage, getSlippageData } from '../controllers/quoteController';

const router = Router();

router.get('/quotes', getQuotes);
router.get('/average', getAverage);
router.get('/slippage', getSlippageData);

export default router;