# Company Details Search - Frontend

Vue 3 frontend for vessel search and AI-powered company enrichment.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
```

3. Run development server:
```bash
npm run dev
```

## Features

- **Authentication**: Login with Pole Star credentials
- **Vessel Search**: Search by name, IMO, or MMSI
- **Vessel Details**: View comprehensive vessel information
- **Company Search**: AI-powered company enrichment with contact details
- **Persona Selection**: Prioritise results based on user role

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_POLESTAR_API_BASE_URL` | Pole Star API URL |

## Build

```bash
npm run build
```

## Deployment (Render Static Site)

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Add redirect rule: `/* -> /index.html` (for SPA routing)
