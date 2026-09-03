import express from "express";
import { authRoutes } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);

app.use(errorHandler);
