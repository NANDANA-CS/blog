import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import url from "url";
import connection from "./connection.js";
import blog_routes from './routes/blog_routes.js'

dotenv.config();

const app = express();
const port =  4000;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/images", express.static(path.join(__dirname, "images")));

// Routes
app.use('/api',blog_routes)



// Start server after DB connection
connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  })