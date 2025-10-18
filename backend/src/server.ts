import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js"; // no .ts
import app from "./app.js"; // no .ts

connectDB();


const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
