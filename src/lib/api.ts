import { AnalysisResult } from "../types";
import { base64ToBlob } from "./utils";

/**
 * Sends an image to the /analyze endpoint for processing.
 */
export async function analyzeImage(imageFile: { data: string; mimeType: string }): Promise<AnalysisResult> {
  const blob = base64ToBlob(imageFile.data, imageFile.mimeType);
  const formData = new FormData();
  formData.append('image', blob, 'upload.jpg');

  const response = await fetch('/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to analyze image");
  }

  return response.json();
}
