import { GoogleGenAI } from "@google/genai";
import { 
  WeatherResponse, 
  VideoResponse, 
  TranslationResponse, 
  MathResponse,
  ImageResponse,
  RecipeResponse
} from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

// Helper to clean JSON string from Markdown
const cleanJson = (text: string) => {
  return text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
};

// --- WEATHER ---
export const fetchWeather = async (query: string): Promise<WeatherResponse> => {
  try {
    const prompt = `
      Get real-time weather & 5-day forecast for: "${query}".
      Use Google Search to get current data.
      Return VALID JSON ONLY. Do not use Markdown blocks.
      Schema:
      {
        "location": "City, Country",
        "current": { "temp_c": number, "condition": "text", "humidity": number, "wind_kph": number, "feels_like_c": number },
        "forecast": [{ "date": "Day", "max_temp_c": number, "min_temp_c": number, "condition": "text" }],
        "summary": "Short summary."
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" // Not allowed with googleSearch
      },
    });

    let text = response.text || "{}";
    text = cleanJson(text);
    
    let data = null;
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.warn("Weather JSON parse failed", text);
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      data: data,
      groundingMetadata: groundingChunks as any[],
      rawText: response.text
    };

  } catch (error) {
    console.error("Weather error", error);
    return { data: null, groundingMetadata: [] };
  }
};

// --- YOUTUBE ---
export const fetchVideoDetails = async (videoId: string): Promise<VideoResponse> => {
  try {
    // Improved prompt to be more robust about finding the specific video
    const prompt = `
      Search for the YouTube video with ID "${videoId}".
      I need the exact details for this specific video.
      Return VALID JSON ONLY. Do not use Markdown blocks.
      Schema:
      {
        "title": "Exact Video Title",
        "channel": "Channel Name",
        "views": "View count (approx)",
        "description": "Short description (max 150 chars)"
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Search helps verify the ID details
        // responseMimeType: "application/json" // Not allowed with googleSearch
      },
    });

    let text = response.text || "{}";
    text = cleanJson(text);

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        // Fallback object if parsing fails but request succeeded
        data = {
            title: "Unknown Video",
            channel: "YouTube",
            views: "---",
            description: "Could not parse metadata."
        };
    }
    
    // Enrich with local data
    data.videoId = videoId;
    data.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      data: data,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Video error", error);
    // Return partial data so the user can still try to download even if metadata fails
    return { 
      data: {
        title: "Unknown Video",
        channel: "YouTube",
        views: "---",
        description: "Could not fetch metadata, but you can still try downloading.",
        videoId: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      }, 
      groundingMetadata: [] 
    };
  }
};

// --- TRANSLATION ---
export const translateText = async (text: string, targetLang: string): Promise<TranslationResponse> => {
  try {
    const prompt = `
      Translate to ${targetLang}. Detect source. JSON ONLY.
      Schema: { "translatedText": "text", "detectedLanguage": "lang" }
      Input: "${text}"
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { translatedText: "Error translating." };
  }
};

// --- CHAT (COMPLETE AI) ---
export const createChatSession = () => {
  return ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: "You are Gemini, a helpful, witty, and intelligent AI assistant. Keep responses concise and helpful.",
    }
  });
};

// --- IMAGE GENERATION ---
export const generateImage = async (prompt: string): Promise<ImageResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          numberOfImages: 1
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return { imageUrl: `data:image/png;base64,${part.inlineData.data}` };
      }
    }
    return { imageUrl: null, error: "No image generated." };
  } catch (error) {
    console.error("Image gen error", error);
    return { imageUrl: null, error: "Failed to generate image." };
  }
};

// --- MATH ---
export const solveMath = async (input: string): Promise<MathResponse> => {
  try {
    const prompt = `
      Solve this math problem step-by-step: "${input}".
      JSON ONLY.
      Schema:
      {
        "topic": "e.g. Calculus",
        "result": "Final Answer",
        "steps": ["Step 1 explanation", "Step 2 explanation"]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return { data: JSON.parse(response.text || "{}") };
  } catch (error) {
    return { data: null };
  }
};

// --- RECIPE ---
export const generateRecipe = async (input: string): Promise<RecipeResponse> => {
  try {
    const prompt = `
      Create a detailed cooking recipe for: "${input}".
      Return JSON ONLY.
      Schema:
      {
        "title": "Recipe Title",
        "description": "Short appetizing description",
        "ingredients": ["ingredient 1", "ingredient 2"],
        "instructions": ["step 1", "step 2"],
        "prepTime": "e.g. 30 mins",
        "calories": "e.g. 500 kcal"
      }
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = response.text || "{}";
    return { data: JSON.parse(text) };
  } catch (error) {
    console.error("Recipe error", error);
    return { data: null };
  }
};