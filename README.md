# SmartFin AI

**AI-Powered Personal Finance Management and Expense Prediction System**

Final Year Project · Karakoram International University  
**Student:** Ansar Ali (2022-KIU-BS2272)  
**Supervisor:** Mr. Zahidullah

## Single Next.js App

Everything runs on **one port** — frontend UI and backend API together:

| What | URL |
|------|-----|
| Website & Dashboard | `http://localhost:3000` |
| API Routes | `http://localhost:3000/api/*` |

No separate Express or FastAPI server needed for development.

## Tech Stack

- **Next.js 16** — React UI + API routes
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Recharts** — Charts
- **MongoDB** — (planned) database via API routes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/dashboard` | Dashboard summary |
| GET/POST | `/api/transactions` | Income & expenses |
| GET | `/api/budgets` | Budgets |
| GET | `/api/savings-goals` | Savings goals |
| GET | `/api/predictions` | ML predictions |
| GET | `/api/anomalies` | Unusual spending |
| GET | `/api/insights` | AI insights |
| GET | `/api/ml/predict` | ML prediction service |
| GET | `/api/ml/health-score` | Financial health score |

## Project Structure

```
SmartFin-AI/
├── src/
│   ├── app/
│   │   ├── api/          # Backend API routes (same port)
│   │   ├── (auth)/       # Login & register
│   │   └── (dashboard)/  # All dashboard pages
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
└── package.json
```

## Features

- Income & expense management
- Budgets & savings goals
- Financial analytics dashboard
- ML expense prediction (API stubs ready)
- Anomaly detection & insights
- AI financial assistant
- Notifications & reports

## License

Academic project — Karakoram International University
