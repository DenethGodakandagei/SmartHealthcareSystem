import express from "express";
import type { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js"; 
import { errorHandler } from "./middleware/errorHandler.js"; 

dotenv.config();

const app: Application = express();

//  Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", routes);

//  Health Check Route
app.get("/", (req, res) => {
  res.send("Smart Healthcare System API is running...");
});

//  Global Error Handler
app.use(errorHandler);

export default app;
