import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In production, store API key securely using environment variables
// For Expo, you can use expo-constants or a .env file
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export const getFortuneAdvice = async (balance: number, streak: number): Promise<string> => {
  if (!genAI) {
    return "Your fortune is written in the gold you seek!";
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a mystical "Luck Master" for a mobile reward app. 
      The user has a current balance of ${balance} coins and a daily check-in streak of ${streak} days.
      Give them a short, punchy (max 20 words) mystical fortune advice before they spin the wheel.
      Be encouraging and a bit mysterious.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text || "The stars are aligned for a great spin today!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Your fortune is written in the gold you seek!";
  }
};

