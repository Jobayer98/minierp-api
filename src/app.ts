import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { notFound } from './middlewares/notFound.middleware.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import customerRoutes from './modules/customer/customer.routes.js';
import salesRoutes from './modules/sales/sales.routes.js';
import { buildSpec } from './openapi/loader.js';

const app = express();

// Security & parsing
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Docs
if (env.NODE_ENV !== 'production') {
  const spec = buildSpec();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
}

// Routes
app.use(`${env.API_PREFIX}/auth`, authRoutes);
app.use(`${env.API_PREFIX}/products`, productRoutes);
app.use(`${env.API_PREFIX}/customers`, customerRoutes);
app.use(`${env.API_PREFIX}/sales`, salesRoutes);

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
