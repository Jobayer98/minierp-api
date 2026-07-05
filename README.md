# Mini ERP — Backend API

REST API for Mini ERP built with Node.js, Express, TypeScript, MongoDB, and JWT.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript (ESM)
- **Framework:** Express v5
- **Database:** MongoDB via Mongoose v9
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Validation:** Zod v4
- **Image Upload:** Cloudinary (via multer memoryStorage)
- **API Docs:** Swagger UI (`/api-docs`, dev only)

---

## Prerequisites

- Node.js >= 18
- MongoDB Atlas cluster (or local MongoDB)
- Cloudinary account

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in values
cp .env.example .env

# 3. Seed the database (roles, users, products, customers, sales)
npm run seed

# 4. Start dev server
npm run dev
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `API_PREFIX` | Route prefix | `/api/v1` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `a-long-random-string` |
| `JWT_EXPIRES_IN` | JWT expiry | `1d` |
| `BCRYPT_SALT_ROUNDS` | bcrypt cost factor | `10` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `MAX_FILE_SIZE_MB` | Max upload size | `2` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc123...` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |
| `SEED_ADMIN_EMAIL` | Admin seed email | `admin@example.com` |
| `SEED_ADMIN_PASSWORD` | Admin seed password | `Admin@1234` |
| `SEED_MANAGER_EMAIL` | Manager seed email | `manager@example.com` |
| `SEED_MANAGER_PASSWORD` | Manager seed password | `Manager@1234` |
| `SEED_EMPLOYEE_EMAIL` | Employee seed email | `employee@example.com` |
| `SEED_EMPLOYEE_PASSWORD` | Employee seed password | `Employee@1234` |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production build |
| `npm run seed` | Seed roles, users, products, customers, and sales |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |

---

## Seed Credentials

After running `npm run seed`, the following accounts are available:

| Role | Email | Password |
|---|---|---|
| Admin | value of `SEED_ADMIN_EMAIL` | value of `SEED_ADMIN_PASSWORD` |
| Manager | value of `SEED_MANAGER_EMAIL` | value of `SEED_MANAGER_PASSWORD` |
| Employee | value of `SEED_EMPLOYEE_EMAIL` | value of `SEED_EMPLOYEE_PASSWORD` |

---

## API Overview

Base URL: `http://localhost:5000/api/v1`

Interactive docs available at `http://localhost:5000/api-docs` (dev only).

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/me` | Authenticated | Current user profile |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | All roles | List with search, filter, pagination |
| GET | `/products/:id` | All roles | Single product |
| POST | `/products` | Admin, Manager | Create (multipart/form-data, image required) |
| PATCH | `/products/:id` | Admin, Manager | Update (image optional) |
| DELETE | `/products/:id` | Admin | Soft delete |

### Customers
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/customers` | Admin, Manager | List with search, pagination |
| GET | `/customers/:id` | Admin, Manager | Single customer |
| POST | `/customers` | Admin, Manager | Create |
| PATCH | `/customers/:id` | Admin, Manager | Update |
| DELETE | `/customers/:id` | Admin | Delete |

### Sales
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/sales` | All roles | Paginated sale history |
| GET | `/sales/:id` | All roles | Single sale detail |
| POST | `/sales` | All roles | Create sale (atomic stock deduction) |

### Dashboard
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/dashboard/stats` | All roles | Counts + low stock list |

### Roles (Bonus — Dynamic RBAC)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/roles` | Admin | List all roles and permissions |
| GET | `/roles/:name` | Admin | Single role |
| PATCH | `/roles/:name/permissions` | Admin | Update role permissions |

---

## Response Format

**Success:**
```json
{
  "success": true,
  "message": "Products fetched",
  "data": [...],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email address" }]
}
```

---

## Security Notes

- Passwords hashed with bcrypt (cost factor 10), never returned in responses (`select: false`)
- JWT validated on every protected route via `Authorization: Bearer <token>` header
- RBAC enforced at route level — role-based (`requireRole`) and permission-based (`requirePermission`)
- Input validated with Zod at route boundary before reaching service layer
- Mongoose `strict: true` on all schemas — prevents field injection
- Rate limiting on `/auth/login` to slow brute force
- Cloudinary used for image storage — no user-controlled filenames, no local executable paths
- Stack traces never leaked in production responses
