import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    feelsLike: number;
    high: number;
    low: number;
    humidity: string;
    uvIndex: string;
    wind: string;
    sunset: string;
    sunrise: string;
  };
  airQuality: {
    aqi: number;
    level: string;
    pollutants: {
      pm25: string;
      pm10: string;
      o3: string;
      no2: string;
      so2: string;
      co: string;
    };
  };
  hourly: {
    time: string;
    temp: number;
    condition: string;
  }[];
  daily: {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainChance: string;
  }[];
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  const isCoords = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(location);
  const query = isCoords 
    ? `Utiliza Google Search para obtener el clima actual de Google, la calidad del aire (AQI y contaminantes), el pronóstico por hora para las próximas 24 horas y el pronóstico de 10 días para las coordenadas ${location}. Identifica la ciudad o región correspondiente basándote en los resultados de Google.`
    : `Utiliza Google Search para obtener el clima actual de Google, la calidad del aire (AQI y contaminantes), el pronóstico por hora para las próximas 24 horas y el pronóstico de 10 días para ${location}.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `${query} Responde estrictamente en formato JSON en español. Asegúrate de que los datos coincidan con lo que muestra Google Clima y fuentes confiables de calidad del aire.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          current: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              feelsLike: { type: Type.NUMBER },
              high: { type: Type.NUMBER },
              low: { type: Type.NUMBER },
              humidity: { type: Type.STRING },
              uvIndex: { type: Type.STRING },
              wind: { type: Type.STRING },
              sunset: { type: Type.STRING },
              sunrise: { type: Type.STRING },
            },
            required: ["temp", "condition", "feelsLike", "high", "low", "humidity", "uvIndex", "wind", "sunset", "sunrise"],
          },
          airQuality: {
            type: Type.OBJECT,
            properties: {
              aqi: { type: Type.NUMBER },
              level: { type: Type.STRING },
              pollutants: {
                type: Type.OBJECT,
                properties: {
                  pm25: { type: Type.STRING },
                  pm10: { type: Type.STRING },
                  o3: { type: Type.STRING },
                  no2: { type: Type.STRING },
                  so2: { type: Type.STRING },
                  co: { type: Type.STRING },
                },
                required: ["pm25", "pm10", "o3", "no2", "so2", "co"],
              },
            },
            required: ["aqi", "level", "pollutants"],
          },
          hourly: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
              },
              required: ["time", "temp", "condition"],
            },
          },
          daily: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                tempMax: { type: Type.NUMBER },
                tempMin: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                rainChance: { type: Type.STRING },
              },
              required: ["day", "tempMax", "tempMin", "condition", "rainChance"],
            },
          },
        },
        required: ["location", "current", "hourly", "daily"],
      },
    },
  });

  return JSON.parse(response.text);
}
