# Backend Agent Guide — Mini ERP

## Stack
Node.js · Express · TypeScript · MongoDB (Mongoose) · JWT · Zod · Multer

## Folder Structure
```
src/
├── config/         # env.ts (zod-validated), db.ts, multer.ts
├── modules/        # feature modules (auth, user, product, customer, sales, dashboard)
│   └── <module>/   # <module>.routes.ts · .controller.ts · .service.ts · .model.ts · .validation.ts
├── middlewares/    # auth, rbac, validate, errorHandler, notFound, rateLimiter
├── common/
│   ├── utils/      # ApiResponse, ApiError, asyncHandler, queryBuilder
│   └── constants/  # roles.ts, httpStatus.ts
├── app.ts          # express wiring
└── server.ts       # entry point
```

## Key Conventions

- **Controllers** — parse req/res only, delegate all logic to services via `asyncHandler`
- **Services** — all business logic lives here (stock checks, totals, transactions)
- **Validation** — Zod schemas in `<module>.validation.ts`, applied via `validate.middleware.ts` before the controller
- **Responses** — always use `ApiResponse` (success) and `ApiError` (errors); global error handler in `errorHandler.middleware.ts` formats all errors
- **RBAC** — `verifyToken` → `requireRole([...roles])` applied at the route level, never inside controllers

## Modules & Routes (prefix: `/api/v1`)

| Module | Routes |
|---|---|
| auth | `POST /auth/login`, `GET /auth/me` |
| product | CRUD `/products` — Admin/Manager write, all roles read; multipart image upload |
| customer | CRUD `/customers` — Admin/Manager only |
| sales | `POST /sales` (atomic stock deduction + transaction), `GET /sales`, `GET /sales/:id` |
| dashboard | `GET /dashboard/stats` — counts + low stock list |

## Sales Service Logic (`sales.service.ts`)
1. Validate items array (non-empty, valid product IDs)
2. Check `stockQuantity >= quantity` per item — throw `400` with offending SKU if not
3. Snapshot `productName` and `unitPrice` from current product data
4. Open Mongoose session → atomic `findOneAndUpdate` stock decrement per item → insert Sale → commit

## Shared Utilities
- `ApiResponse` — `{ success, message, data, meta }`
- `ApiError` — extends Error with `statusCode` and optional `errors[]`
- `asyncHandler` — wraps async controllers, forwards errors to global handler
- `queryBuilder` — generic search/filter/sort/paginate for list endpoints

## Environment Variables (see `.env.example`)
`PORT` · `MONGO_URI` · `JWT_SECRET` · `JWT_EXPIRES_IN` · `NODE_ENV` · `ALLOWED_ORIGIN`

## Rules for Modifications
- Never import a module's model directly from another module — call its service instead
- Always validate at the route boundary; never trust `req.body` raw in services
- Stock mutations only through `sales.service.ts`, never via direct product routes
- Keep `password` field `select: false` on User model; never return it in responses
