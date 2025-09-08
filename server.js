import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

// Middleware to parse JSON
app.use(express.json());

// --- Example API route ---
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

// --- 404 handler for API routes ---
app.use(/^\/api\//, (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

// --- Serve frontend (React build) ---
app.use(express.static(path.join(__dirname, "dist")));

// --- Catch-all route for React Router ---
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
