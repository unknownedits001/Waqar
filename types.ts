export interface ForecastDay {
  date: string;
  max_temp_c: number;
  min_temp_c: number;
  condition: string;
}

export interface CurrentWeather {
  temp_c: number;
  condition: string;
  humidity: number;
  wind_kph: number;
  feels_like_c: number;
}

export interface WeatherData {
  location: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  summary: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface WeatherResponse {
  data: WeatherData | null;
  groundingMetadata: GroundingChunk[];
  rawText?: string;
}

export interface VideoData {
  title: string;
  channel: string;
  views: string;
  description: string;
  videoId: string;
  thumbnail: string;
}

export interface VideoResponse {
  data: VideoData | null;
  groundingMetadata: GroundingChunk[];
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export interface MathData {
  result: string;
  steps: string[];
  topic: string;
}

export interface MathResponse {
  data: MathData | null;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface ImageResponse {
  imageUrl: string | null;
  error?: string;
}

export interface RecipeData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  calories: string;
}

export interface RecipeResponse {
  data: RecipeData | null;
}