import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import route modules
import routes from "./routes/index.js"; // your main routes (auth, patients, doctors, records)
import HealthcareReportRoutes from "./routes/HealthcareReport.routes.js";

// Import middleware
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app: Application = express();

//  Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  API Routes
app.use("/api", routes);

//  Report Routes (register separately)
app.use("/api/reports", HealthcareReportRoutes);

//  Health Check Route
app.get("/", (req, res) => {
  res.send("Smart Healthcare System API is running...");
});

//  Global Error Handler
app.use(errorHandler);

export default app;
