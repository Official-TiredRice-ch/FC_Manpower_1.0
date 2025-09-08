import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

// Serve static files
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all route (fix here!)
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
