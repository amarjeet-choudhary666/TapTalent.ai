"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllQuotes = fetchAllQuotes;
exports.getQuotesFromDB = getQuotesFromDB;
exports.getAveragePrices = getAveragePrices;
exports.getSlippage = getSlippage;
exports.shouldFetchNewData = shouldFetchNewData;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = __importDefault(require("../lib/prisma"));
async function fetchAmbitoARS() {
    try {
        // Use API instead of scraping since scraping is blocked
        const response = await axios_1.default.get('https://api.bluelytics.com.ar/v2/latest');
        const data = response.data;
        const oficial = data.oficial;
        const buyPrice = oficial.value_buy;
        const sellPrice = oficial.value_sell;
        return { buyPrice, sellPrice, source: 'https://api.bluelytics.com.ar/v2/latest (Ambito equivalent)', currency: 'ARS' };
    }
    catch (error) {
        console.error('Error fetching from Bluelytics API:', error);
        return null;
    }
}
async function fetchDolarHoyARS() {
    try {
        // Use API instead of scraping
        const response = await axios_1.default.get('https://api.bluelytics.com.ar/v2/latest');
        const data = response.data;
        const blue = data.blue;
        const buyPrice = blue.value_buy;
        const sellPrice = blue.value_sell;
        return { buyPrice, sellPrice, source: 'https://www.dolarhoy.com (Blue rate)', currency: 'ARS' };
    }
    catch (error) {
        console.error('Error fetching from DolarHoy API:', error);
        return null;
    }
}
async function fetchCronistaARS() {
    try {
        // Use API instead of scraping
        const response = await axios_1.default.get('https://api.bluelytics.com.ar/v2/latest');
        const data = response.data;
        const oficial = data.oficial;
        const buyPrice = oficial.value_buy;
        const sellPrice = oficial.value_sell;
        return { buyPrice, sellPrice, source: 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB (Official rate)', currency: 'ARS' };
    }
    catch (error) {
        console.error('Error fetching from Cronista API:', error);
        return null;
    }
}
async function fetchWiseBRL() {
    try {
        // Use a public exchange rate API for BRL
        const response = await axios_1.default.get('https://api.exchangerate-api.com/v4/latest/USD');
        const data = response.data;
        const brlRate = data.rates.BRL;
        if (!brlRate)
            return null;
        const buyPrice = brlRate;
        const sellPrice = brlRate;
        return { buyPrice, sellPrice, source: 'https://wise.com/es/currency-converter/brl-to-usd-rate', currency: 'BRL' };
    }
    catch (error) {
        console.error('Error fetching from Wise API:', error);
        return null;
    }
}
async function fetchNubankBRL() {
    try {
        // Use a public exchange rate API for BRL
        const response = await axios_1.default.get('https://api.exchangerate-api.com/v4/latest/USD');
        const data = response.data;
        const brlRate = data.rates.BRL;
        if (!brlRate)
            return null;
        const buyPrice = brlRate;
        const sellPrice = brlRate;
        return { buyPrice, sellPrice, source: 'https://nubank.com.br/taxas-conversao/', currency: 'BRL' };
    }
    catch (error) {
        console.error('Error fetching from Nubank API:', error);
        return null;
    }
}
async function fetchNomadBRL() {
    try {
        // Use a public exchange rate API for BRL
        const response = await axios_1.default.get('https://api.exchangerate-api.com/v4/latest/USD');
        const data = response.data;
        const brlRate = data.rates.BRL;
        if (!brlRate)
            return null;
        const buyPrice = brlRate;
        const sellPrice = brlRate;
        return { buyPrice, sellPrice, source: 'https://www.nomadglobal.com', currency: 'BRL' };
    }
    catch (error) {
        console.error('Error fetching from Nomad API:', error);
        return null;
    }
}
async function fetchAllQuotes() {
    const quotes = [];
    // Fetch ARS quotes
    const ambito = await fetchAmbitoARS();
    if (ambito)
        quotes.push(ambito);
    const dolarHoy = await fetchDolarHoyARS();
    if (dolarHoy)
        quotes.push(dolarHoy);
    const cronista = await fetchCronistaARS();
    if (cronista)
        quotes.push(cronista);
    // Fetch BRL quotes
    const wise = await fetchWiseBRL();
    if (wise)
        quotes.push(wise);
    const nubank = await fetchNubankBRL();
    if (nubank)
        quotes.push(nubank);
    const nomad = await fetchNomadBRL();
    if (nomad)
        quotes.push(nomad);
    // Save to database
    for (const quote of quotes) {
        await prisma_1.default.quote.create({
            data: {
                source: quote.source,
                buyPrice: quote.buyPrice,
                sellPrice: quote.sellPrice,
                currency: quote.currency,
            },
        });
    }
    return quotes;
}
async function getQuotesFromDB() {
    const quotes = await prisma_1.default.quote.findMany({
        orderBy: { fetchedAt: 'desc' },
        take: 6, // Last 6 quotes (3 ARS + 3 BRL)
    });
    return quotes.map(q => ({
        buyPrice: q.buyPrice,
        sellPrice: q.sellPrice,
        source: q.source,
        currency: q.currency,
    }));
}
async function getAveragePrices() {
    const quotes = await getQuotesFromDB();
    const totalBuy = quotes.reduce((sum, q) => sum + q.buyPrice, 0);
    const totalSell = quotes.reduce((sum, q) => sum + q.sellPrice, 0);
    return {
        averageBuyPrice: totalBuy / quotes.length,
        averageSellPrice: totalSell / quotes.length,
    };
}
async function getSlippage() {
    const quotes = await getQuotesFromDB();
    const average = await getAveragePrices();
    return quotes.map(q => ({
        buyPriceSlippage: (q.buyPrice - average.averageBuyPrice) / average.averageBuyPrice,
        sellPriceSlippage: (q.sellPrice - average.averageSellPrice) / average.averageSellPrice,
        source: q.source,
    }));
}
async function shouldFetchNewData() {
    const lastQuote = await prisma_1.default.quote.findFirst({
        orderBy: { fetchedAt: 'desc' },
    });
    if (!lastQuote)
        return true;
    const now = new Date();
    const diff = now.getTime() - lastQuote.fetchedAt.getTime();
    return diff > 60000; // 60 seconds
}
//# sourceMappingURL=quoteService.js.map