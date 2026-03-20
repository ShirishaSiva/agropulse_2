import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "./server.ts";
import * as geminiService from "./src/services/geminiService.ts";

// Mock the geminiService to return what the test expects
vi.mock("./src/services/geminiService.ts", () => ({
  analyzeAgriculturalInput: vi.fn().mockResolvedValue({
    immediateAction: {
      instruction: "Apply pesticide",
      severity: "alert",
    },
    diagnosis: "Pest Detected: Aphids infestation",
    threats: [],
    marketAdvice: { recommendation: "Hold", reasoning: "Price rising" },
    verificationSource: "Mock Source",
    detectedLanguage: "English",
  }),
}));

describe("POST /analyze", () => {
  it("Should return advice for a valid leaf image", async () => {
    // Create a dummy image buffer
    const dummyImage = Buffer.from("dummy-image-data");

    const response = await request(app)
      .post("/analyze")
      .attach("image", dummyImage, "tulips.jpg");

    expect(response.status).toBe(200);
    expect(response.body.action).toBeDefined(); // Ensure it gives an action
    expect(response.body.crop_health).toBe("Pest Detected");
  });

  it("Should return 400 if no image is provided", async () => {
    const response = await request(app).post("/analyze");
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("No image file provided");
  });
});
