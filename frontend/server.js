import express from "express";
import path from "path";
import { fileURLToPath } from "url";  // Import fileURLToPath to handle __dirname in ES Modules

const app = express();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3221;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on http://54.85.236.167:${PORT}`);
});
