import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { analyzeAgriculturalInput } from "./src/services/geminiService.ts";
import { formatFileForGemini } from "./src/lib/utils.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * API Routes
 */

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Analysis endpoint
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    const fileData = formatFileForGemini(req.file);
    const result = await analyzeAgriculturalInput([fileData]);

    // Map the result to what the user's test expects
    // The user's test expects 'action' and 'crop_health'
    res.json({
      ...result,
      action: result.immediateAction.instruction,
      crop_health: result.diagnosis.includes("Pest") ? "Pest Detected" : result.diagnosis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze image";
    res.status(500).json({ error: message });
  }
});

/**
 * Server Startup
 */
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AgroPulse] Server running on http://localhost:${PORT}`);
  });
}

// Start server if not in test environment
if (process.env.NODE_ENV !== "test") {
  startServer().catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

export default app;
