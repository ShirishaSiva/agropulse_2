import { GoogleGenAI, Type } from "@google/genai";

export interface AnalysisResult {
  immediateAction: {
    instruction: string;
    severity: 'safe' | 'warning' | 'alert';
  };
  diagnosis: string;
  threats: {
    type: string;
    location: string;
    radiusKm: number;
    description: string;
    coordinates?: { lat: number; lng: number };
  }[];
  marketAdvice: {
    recommendation: string;
    reasoning: string;
  };
  verificationSource: string;
  detectedLanguage: string;
}

export async function analyzeAgriculturalInput(
  files: { data: string; mimeType: string }[],
  weatherData?: any,
  marketData?: any
): Promise<AnalysisResult> {
  const API_KEY = process.env.GEMINI_API_KEY || "";
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is missing. Please add it to the Secrets panel.");
  }
  const genAI = new GoogleGenAI({ apiKey: API_KEY });
  const model = genAI.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: [
      {
        parts: [
          ...files.map(f => ({
            inlineData: {
              data: f.data.split(',')[1] || f.data,
              mimeType: f.mimeType
            }
          })),
          {
            text: `Analyze the provided agricultural inputs (images of crops, audio of news/voice memos, etc.). 
            Context:
            Weather: ${JSON.stringify(weatherData || "Unknown")}
            Market: ${JSON.stringify(marketData || "Unknown")}
            
            Identify crop health issues, extract threats from audio, and synthesize an action plan.
            Provide the output in the user's local language if detected, but keep the structure as JSON.
            
            The response must be a valid JSON object matching this schema:
            {
              "immediateAction": {
                "instruction": "Short, bold instruction",
                "severity": "safe" | "warning" | "alert"
              },
              "diagnosis": "Detailed diagnosis of crop health or situation",
              "threats": [
                {
                  "type": "e.g., Locusts, Drought, Pest",
                  "location": "Location name",
                  "radiusKm": number,
                  "description": "Brief threat details",
                  "coordinates": { "lat": number, "lng": number }
                }
              ],
              "marketAdvice": {
                "recommendation": "Sell/Hold advice",
                "reasoning": "Why this advice"
              },
              "verificationSource": "Source of information (e.g., Radio broadcast, Botanical DB)",
              "detectedLanguage": "Language name"
            }`
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          immediateAction: {
            type: Type.OBJECT,
            properties: {
              instruction: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ['safe', 'warning', 'alert'] }
            },
            required: ['instruction', 'severity']
          },
          diagnosis: { type: Type.STRING },
          threats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                location: { type: Type.STRING },
                radiusKm: { type: Type.NUMBER },
                description: { type: Type.STRING },
                coordinates: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER }
                  }
                }
              }
            }
          },
          marketAdvice: {
            type: Type.OBJECT,
            properties: {
              recommendation: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          },
          verificationSource: { type: Type.STRING },
          detectedLanguage: { type: Type.STRING }
        },
        required: ['immediateAction', 'diagnosis', 'threats', 'marketAdvice', 'verificationSource', 'detectedLanguage']
      }
    }
  });

  const response = await model;
  return JSON.parse(response.text);
}
