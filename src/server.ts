import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

const start = async () => {
  await connectDB();
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => process.exit(0));
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

start();
