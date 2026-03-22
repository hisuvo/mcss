import express from "express";
import { IndexRoutes } from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import status from "http-status";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(status.OK).json({
    success: true,
    message: "API is working",
  });
});

app.use("/api/v1", IndexRoutes);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
