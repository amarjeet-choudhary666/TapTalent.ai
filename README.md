# TapTalent.ai Currency Exchange API

A Node.js backend API that provides real-time currency exchange rates for USD to ARS (Argentina) and USD to BRL (Brazil) conversions.

## 🚀 Live API Endpoints

The API is deployed and available at:

- **Quotes**: https://taptalent-ai-assignment.onrender.com/api/quotes
- **Average**: https://taptalent-ai-assignment.onrender.com/api/average
- **Slippage**: https://taptalent-ai-assignment.onrender.com/api/slippage

## 📋 Features

- **Real-time Data**: Fetches fresh currency exchange rates (max 60 seconds old)
- **Multiple Sources**: Aggregates data from 6 different financial sources
- **Currency Support**: ARS (Argentina) and BRL (Brazil)
- **Data Validation**: Zod schema validation for all responses
- **Database Storage**: PostgreSQL with Prisma ORM
- **TypeScript**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **HTTP Client**: Axios
- **Deployment**: Render

## 📊 API Endpoints

### GET /api/quotes
Returns an array of currency exchange quotes from all sources.

**Response:**
```json
[
  {
    "buyPrice": 1417,
    "sellPrice": 1470,
    "source": "https://api.bluelytics.com.ar/v2/latest (Ambito equivalent)",
    "currency": "ARS"
  },
  {
    "buyPrice": 1435,
    "sellPrice": 1455,
    "source": "https://www.dolarhoy.com (Blue rate)",
    "currency": "ARS"
  },
  {
    "buyPrice": 1417,
    "sellPrice": 1470,
    "source": "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB (Official rate)",
    "currency": "ARS"
  },
  {
    "buyPrice": 5.38,
    "sellPrice": 5.38,
    "source": "https://wise.com/es/currency-converter/brl-to-usd-rate",
    "currency": "BRL"
  },
  {
    "buyPrice": 5.38,
    "sellPrice": 5.38,
    "source": "https://nubank.com.br/taxas-conversao/",
    "currency": "BRL"
  },
  {
    "buyPrice": 5.38,
    "sellPrice": 5.38,
    "source": "https://www.nomadglobal.com",
    "currency": "BRL"
  }
]
```

### GET /api/average
Returns the average buy and sell prices across all quotes.

**Response:**
```json
{
  "averageBuyPrice": 714.19,
  "averageSellPrice": 735.19
}
```

### GET /api/slippage
Returns slippage percentages for each source compared to the average.

**Response:**
```json
[
  {
    "buyPriceSlippage": 1.234704418154148,
    "sellPriceSlippage": 1.243892262642247,
    "source": "https://api.bluelytics.com.ar/v2/latest (Ambito equivalent)"
  }
]
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   └── quoteController.ts    # API endpoint handlers
│   ├── services/
│   │   └── quoteService.ts       # Business logic & data fetching
│   ├── validation/
│   │   └── quoteValidation.ts    # Zod validation schemas
│   ├── routes/
│   │   └── quoteRoutes.ts        # Express routes
│   ├── lib/
│   │   └── prisma.ts             # Database client
│   ├── db/
│   │   └── index.ts              # Database connection
│   ├── app.ts                    # Express app setup
│   └── index.ts                  # Server entry point
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```
   DATABASE_URL="your-postgresql-connection-string"
   PORT=3000
   ```

4. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

5. **Generate Prisma client**
   ```bash
   npm run prisma:generate
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 📊 Data Sources

### ARS (Argentina Peso)
- **Ambito**: Official exchange rate via Bluelytics API
- **DolarHoy**: Blue market rate via Bluelytics API
- **Cronista**: Official exchange rate via Bluelytics API

### BRL (Brazilian Real)
- **Wise**: Exchange rate via ExchangeRate-API
- **Nubank**: Exchange rate via ExchangeRate-API
- **Nomad**: Exchange rate via ExchangeRate-API

## 🔄 Data Freshness

The API automatically ensures data freshness:
- Checks if data is older than 60 seconds
- Fetches new data from all sources if needed
- Serves cached data if within the freshness window

## 📝 Assignment Requirements Met

✅ **HTTP Server**: Node.js + Express API server
✅ **3 Endpoints**: `/quotes`, `/average`, `/slippage`
✅ **6 Data Sources**: 3 ARS + 3 BRL sources
✅ **Fresh Data**: Max 60 seconds between updates
✅ **SQL Database**: PostgreSQL with proper schema
✅ **Data Structure**: Correct JSON response formats
✅ **Deployment**: Live on Render platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request
