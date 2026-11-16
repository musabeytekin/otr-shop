# otr-shop

An e-commerce store built as the foundation for a production-grade customer support agent.

The store is a real, working shop: a [Medusa](https://medusajs.com) v2 backend with an admin dashboard and a Next.js storefront customers can browse. The support agent will be built on top of it as a separate service that talks to the store through its APIs.

## Roadmap

1. **Store foundation** — backend, admin, storefront, database. *(done)*
2. **Catalog** — import real product data.
3. **Customers and order history** — synthetic customers and orders with realistic lifecycle distributions, including delayed, returned, refunded and cancelled orders.
4. **Support groundwork** — store policies, FAQ / knowledge base, tickets and conversation history.
5. **Support agent** — tools, policies, human handoff, evaluation.

## Structure

```text
.
├── apps/
│   ├── backend/        # Medusa application: store + admin APIs, admin dashboard
│   ├── storefront/     # Next.js storefront
│   └── agent/          # Customer support agent service (planned)
├── data/               # Dataset download and import scripts (planned)
├── docker-compose.yml  # Local services (PostgreSQL)
├── AGENTS.md           # Conventions for working in this repository
└── turbo.json          # Task graph
```

## Requirements

- Node.js 22.23+ (24 LTS recommended)
- npm
- Docker

## Getting started

```bash
npm install
npm run db:up
```

Copy `apps/backend/.env.template` to `apps/backend/.env` and adjust if needed, then run the migrations and create an admin user:

```bash
cd apps/backend
npm exec medusa db:migrate
npm exec medusa user -- -e <email> -p <password>
```

The storefront needs `apps/storefront/.env.local` with `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` set to a publishable API key from the admin dashboard (Settings → Publishable API Keys) and `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`.

Start everything from the repository root:

```bash
npm run dev
```

| Service | URL |
| --- | --- |
| Storefront | http://localhost:8000 |
| Store / admin API | http://localhost:9000 |
| Admin dashboard | http://localhost:9000/app |
| PostgreSQL | `127.0.0.1:5433` (database `otr_shop`) |

## Commands

```bash
npm run dev               # backend + storefront
npm run backend:dev       # backend only
npm run storefront:dev    # storefront only
npm run build             # build all apps
npm run lint              # lint all apps
npm run db:up             # start PostgreSQL
npm run db:down           # stop PostgreSQL (data is kept in a Docker volume)
```

See [AGENTS.md](./AGENTS.md) for the full command list, directory conventions and testing instructions.
