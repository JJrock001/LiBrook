// frontend/server.js
import express from "express";

const app = express();

// Serve static files from the 'public' directory (adjust if needed)
app.use(express.static("public"));

const PORT = process.env.PORT || 3221;  // Default to port 3221 if not set
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend running on http://54.85.236.167:${PORT}`);
});
