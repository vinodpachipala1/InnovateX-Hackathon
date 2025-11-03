import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const PERSONA_CONTEXTS = {
  general:
    "Provide balanced advice for general adult population focusing on daily activities and overall wellbeing.",
  athlete:
    "Focus on exercise recommendations, breathing capacity, and outdoor training safety. Consider workout timing and intensity adjustments.",
  children:
    "Provide child-specific guidance for parents. Focus on outdoor play safety, immune system protection, and age-appropriate precautions.",
  sensitive:
    "Focus on respiratory protection, medication reminders, and extra precautions for sensitive individuals like asthma or elderly.",
};

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.cache = new Map();
    this.cacheTTL = 10 * 60 * 1000;

    if (this.apiKey) {
      this.ai = new GoogleGenAI(this.apiKey);
    } else {
      this.ai = null;
    }
  }

  async generateHealthAdvice(aqiData, persona) {
    const { current } = aqiData;
    const cacheKey = `${current.aqi}-${persona}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data;
    }

    try {
      if (!this.apiKey || !this.ai) {
        throw new Error("AI Service is not configured. Missing API key.");
      }

      const prompt = this.buildSmartPrompt(aqiData, persona);
      const advice = await this.callGeminiAPI(prompt);
      this.cache.set(cacheKey, { data: advice, timestamp: Date.now() });
      return advice;
    } catch (error) {
      throw error;
    }
  }

  buildSmartPrompt(aqiData, persona) {
    const { current, forecast } = aqiData;
    const trend = this.calculateTrend(forecast);
    const locationContext = this.getLocationContext(aqiData.location);
    const personaPrompt = PERSONA_CONTEXTS[persona] || PERSONA_CONTEXTS.general;

    const promptTemplates = [
      `Analyze this air quality for a user.
DATA:
- Current AQI: ${current.aqi} (${current.category.level})
- PM2.5: ${current.pm25.toFixed(1)} μg/m³
- Trend: ${trend}
- Location: ${locationContext}
USER PROFILE: ${persona} (${personaPrompt})
RESPONSE FORMAT:
Respond with ONLY a single, minified JSON object. Do not use markdown.
The structure must be:
{
  "title": "A brief 1-2 sentence situation analysis.",
  "recommendations": [
    "Actionable tip 1",
    "Actionable tip 2",
    "Actionable tip 3"
  ],
  "precaution": "An immediate precaution, or empty string if none."
}`,
    ];
    return promptTemplates[Math.floor(Math.random() * promptTemplates.length)];
  }

  async callGeminiAPI(prompt) {
    try {
      const generationConfig = {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 600,
        responseMimeType: "application/json",
      };

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        generationConfig: generationConfig,
      });
      const adviceText = response.text;

      if (!adviceText) {
        throw new Error("Invalid or empty response from Gemini API");
      }

      return this.parseAIResponse(adviceText);
    } catch (error) {
      if (
        error.message.toLowerCase().includes("rate limit") ||
        error.message.includes("429")
      ) {
        throw new Error("Gemini API rate limit exceeded");
      }
      throw new Error(`Gemini API: ${error.message}`);
    }
  }

  parseAIResponse(rawResponse) {
    try {
      let cleanText = rawResponse.trim();
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.substring(7, cleanText.length - 3).trim();
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.substring(3, cleanText.length - 3).trim();
      }

      const parsed = JSON.parse(cleanText);

      if (!parsed.title || !Array.isArray(parsed.recommendations)) {
        throw new Error(
          "Parsed JSON is missing required fields (title, recommendations)"
        );
      }
      return parsed;
    } catch (parseError) {
      throw new Error("Failed to parse AI response as JSON.");
    }
  }

  calculateTrend(forecast) {
    if (!forecast || forecast.length < 3) return "relatively stable";
    const first = forecast[0].aqi;
    const last = forecast[forecast.length - 1].aqi;
    const change = last - first;
    if (change > 20) return "significantly worsening";
    if (change > 10) return "gradually worsening";
    if (change < -20) return "significantly improving";
    if (change < -10) return "gradually improving";
    return "stable or slightly fluctuating";
  }

  getLocationContext(location) {
    if (!location) return "general area";
    const { lat, lon } = location;
    if (lat > 28 && lat < 30 && lon > 76 && lon < 78)
      return "Delhi metropolitan area";
    if (lat > 16 && lat < 17 && lon > 80 && lon < 81)
      return "Andhra Pradesh region";
    if (lat > 12 && lat < 13 && lon > 77 && lon < 78)
      return "Bangalore urban area";
    return "your local area";
  }
}

export default new AIService();