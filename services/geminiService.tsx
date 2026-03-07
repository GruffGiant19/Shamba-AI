import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have this in your .env file: GEMINI_API_KEY=your_key_here
const genAI = new GoogleGenerativeAI("AIzaSyBYb5hmuPOTKBWZJ9baVQXXmqNSwgWL2tI");

export const getChatResponse = async (
  userMessage: string,
  userProfile?: any,
) => {
  try {
    console.log("🤖 Initializing Gemini...");

    // Use the confirmed production model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const context = userProfile
      ? `You are Shamba AI, an expert agricultural advisor for farmers in Ghana.
        User's Farm: ${userProfile.farmProfile?.farmName || "Unnamed"}
        Crops: ${userProfile.farmProfile?.primaryCrops?.join(", ") || "None listed"}
        Provide specific, local, and actionable advice.`
      : `You are Shamba AI, an agricultural expert. Provide practical farming advice.`;

    const result = await model.generateContent(
      `${context}\n\nUser Question: ${userMessage}`,
    );
    const response = await result.response;

    return response.text();
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message);
    throw new Error("AI service is currently unreachable.");
  }
};
