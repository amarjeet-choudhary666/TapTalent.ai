import axios from 'axios';
import prisma from '../lib/prisma';

interface Quote {
  buyPrice: number;
  sellPrice: number;
  source: string;
  currency: string;
}



async function fetchAmbitoARS(): Promise<Quote | null> {
  try {
    // Use API instead of scraping since scraping is blocked
    const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
    const data = response.data;
    const oficial = data.oficial;
    const buyPrice = oficial.value_buy;
    const sellPrice = oficial.value_sell;
    return { buyPrice, sellPrice, source: 'https://api.bluelytics.com.ar/v2/latest (Ambito equivalent)', currency: 'ARS' };
  } catch (error) {
    console.error('Error fetching from Bluelytics API:', error);
    return null;
  }
}

async function fetchDolarHoyARS(): Promise<Quote | null> {
  try {
    // Use API instead of scraping
    const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
    const data = response.data;
    const blue = data.blue;
    const buyPrice = blue.value_buy;
    const sellPrice = blue.value_sell;
    return { buyPrice, sellPrice, source: 'https://www.dolarhoy.com (Blue rate)', currency: 'ARS' };
  } catch (error) {
    console.error('Error fetching from DolarHoy API:', error);
    return null;
  }
}

async function fetchCronistaARS(): Promise<Quote | null> {
  try {
    // Use API instead of scraping
    const response = await axios.get('https://api.bluelytics.com.ar/v2/latest');
    const data = response.data;
    const oficial = data.oficial;
    const buyPrice = oficial.value_buy;
    const sellPrice = oficial.value_sell;
    return { buyPrice, sellPrice, source: 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB (Official rate)', currency: 'ARS' };
  } catch (error) {
    console.error('Error fetching from Cronista API:', error);
    return null;
  }
}

async function fetchWiseBRL(): Promise<Quote | null> {
  try {
    // Use a public exchange rate API for BRL
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const data = response.data;
    const brlRate = data.rates.BRL;
    if (!brlRate) return null;
    const buyPrice = brlRate;
    const sellPrice = brlRate;
    return { buyPrice, sellPrice, source: 'https://wise.com/es/currency-converter/brl-to-usd-rate', currency: 'BRL' };
  } catch (error) {
    console.error('Error fetching from Wise API:', error);
    return null;
  }
}

async function fetchNubankBRL(): Promise<Quote | null> {
  try {
    // Use a public exchange rate API for BRL
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const data = response.data;
    const brlRate = data.rates.BRL;
    if (!brlRate) return null;
    const buyPrice = brlRate;
    const sellPrice = brlRate;
    return { buyPrice, sellPrice, source: 'https://nubank.com.br/taxas-conversao/', currency: 'BRL' };
  } catch (error) {
    console.error('Error fetching from Nubank API:', error);
    return null;
  }
}

async function fetchNomadBRL(): Promise<Quote | null> {
  try {
    // Use a public exchange rate API for BRL
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const data = response.data;
    const brlRate = data.rates.BRL;
    if (!brlRate) return null;
    const buyPrice = brlRate;
    const sellPrice = brlRate;
    return { buyPrice, sellPrice, source: 'https://www.nomadglobal.com', currency: 'BRL' };
  } catch (error) {
    console.error('Error fetching from Nomad API:', error);
    return null;
  }
}

export async function fetchAllQuotes(): Promise<Quote[]> {
  const quotes: Quote[] = [];

  // Fetch ARS quotes
  const ambito = await fetchAmbitoARS();
  if (ambito) quotes.push(ambito);

  const dolarHoy = await fetchDolarHoyARS();
  if (dolarHoy) quotes.push(dolarHoy);

  const cronista = await fetchCronistaARS();
  if (cronista) quotes.push(cronista);

  // Fetch BRL quotes
  const wise = await fetchWiseBRL();
  if (wise) quotes.push(wise);

  const nubank = await fetchNubankBRL();
  if (nubank) quotes.push(nubank);

  const nomad = await fetchNomadBRL();
  if (nomad) quotes.push(nomad);


  // Save to database
  for (const quote of quotes) {
    await prisma.quote.create({
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

export async function getQuotesFromDB(): Promise<Quote[]> {
  const quotes = await prisma.quote.findMany({
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

export async function getAveragePrices(): Promise<{ averageBuyPrice: number; averageSellPrice: number }> {
  const quotes = await getQuotesFromDB();

  const totalBuy = quotes.reduce((sum, q) => sum + q.buyPrice, 0);
  const totalSell = quotes.reduce((sum, q) => sum + q.sellPrice, 0);

  return {
    averageBuyPrice: totalBuy / quotes.length,
    averageSellPrice: totalSell / quotes.length,
  };
}

export async function getSlippage(): Promise<{ buyPriceSlippage: number; sellPriceSlippage: number; source: string }[]> {
  const quotes = await getQuotesFromDB();
  const average = await getAveragePrices();

  return quotes.map(q => ({
    buyPriceSlippage: (q.buyPrice - average.averageBuyPrice) / average.averageBuyPrice,
    sellPriceSlippage: (q.sellPrice - average.averageSellPrice) / average.averageSellPrice,
    source: q.source,
  }));
}

export async function shouldFetchNewData(): Promise<boolean> {
  const lastQuote = await prisma.quote.findFirst({
    orderBy: { fetchedAt: 'desc' },
  });

  if (!lastQuote) return true;

  const now = new Date();
  const diff = now.getTime() - lastQuote.fetchedAt.getTime();
  return diff > 60000; // 60 seconds
}