import { GoogleGenerativeAI } from "@google/generative-ai";

interface UserProfile {
  farmProfile?: {
    primaryCrops: string[];
    farmName: string;
    location: string;
    farmSize: string;
  };
  experience?: {
    experienceLevel: string;
  };
}

interface UserLog {
  activityType: string;
  crop: string;
  cost: number;
  quantity: number;
  date: string;
}

const genAI = new GoogleGenerativeAI(
  process.env.EXPO_PUBLIC_GEMINI_API_KEY || "",
);
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
console.log("API KEY:", apiKey); // add this temporarily

export const getChatResponse = async (
  userMessage: string,
  userProfile?: UserProfile,
  userLogs?: UserLog[],
) => {
  try {
    console.log("🤖 Initializing Gemini...");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ BUILD CONTEXT FROM USER DATA
    const farmContext = buildFarmContext(userProfile, userLogs);

    // ✅ BUILD SYSTEM PROMPT
    const systemPrompt = `You are Shamba AI, an expert agricultural advisor for small-scale farmers in Ghana and West Africa.

${farmContext}

Your Role:
- Answer ANY farming question the user asks - general knowledge, specific techniques, market info, weather, pests, diseases, etc.
- When relevant, personalize advice using the farmer's actual data above
- Be practical, actionable, and specific to Ghana/West African context
- Keep responses concise (3-5 paragraphs max unless they ask for detail)
- Use simple language - you're talking to farmers, not scientists
- When mentioning expenses, use Ghana Cedis (GH₵)

Response Guidelines:
- If they ask about THEIR farm (e.g., "What crops am I growing?", "How much have I spent?") → Use their actual data from the context above
- If they ask general questions (e.g., "What is post-harvest loss in Ghana?") → Answer with your general knowledge
- If both are relevant (e.g., "How can I reduce my maize expenses?") → Combine their actual maize spending + general cost-saving tips

Examples:
- "What is Ghana's post-harvest loss percentage?" → Answer with general knowledge about post-harvest losses in Ghana
- "What crops am I growing?" → List their actual crops from the farm context
- "How do I improve maize yield?" → Give general maize tips, and if they're growing maize, mention their specific activities
- "When should I plant tomatoes in Kumasi?" → Give location-specific planting calendar advice

Important:
- Never make up data. If you don't have information, say so.
- Don't force personal context into every answer. Use it only when relevant.
- Be encouraging and supportive - farming is hard work!`;

    // ✅ CALL ACTUAL GEMINI AI
    console.log("📤 Sending to Gemini:", userMessage.substring(0, 50) + "...");

    const result = await model.generateContent(
      `${systemPrompt}\n\nUser Question: ${userMessage}`,
    );

    const response = await result.response;
    const aiText = response.text();

    console.log("✅ Gemini responded:", aiText.substring(0, 100) + "...");

    return aiText;
  } catch (error: any) {
    console.error("❌ Gemini API Error:", error.message);
    console.error("Full error:", error);

    // Fallback to basic response if API fails
    return "I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can check the Reports tab to see your farm data.";
  }
};

// ✅ HELPER: BUILD CONTEXT FROM USER DATA
function buildFarmContext(
  userProfile?: UserProfile,
  userLogs?: UserLog[],
): string {
  if (!userProfile) {
    return "Context: This is a new user with no farm data yet.";
  }

  const crops = userProfile?.farmProfile?.primaryCrops || [];
  const farmName = userProfile?.farmProfile?.farmName || "Unknown";
  const location = userProfile?.farmProfile?.location || "Ghana";
  const farmSize = userProfile?.farmProfile?.farmSize || "Unknown";
  const experience = userProfile?.experience?.experienceLevel || "Unknown";

  // Calculate stats from logs
  const totalLogs = userLogs?.length || 0;
  const totalExpenses =
    userLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
  const totalYield =
    userLogs?.reduce((sum, log) => sum + (log.quantity || 0), 0) || 0;

  // Activity breakdown
  const activityCounts: Record<string, number> = {};
  userLogs?.forEach((log) => {
    activityCounts[log.activityType] =
      (activityCounts[log.activityType] || 0) + 1;
  });

  // Crop breakdown
  const cropCounts: Record<string, number> = {};
  const cropExpenses: Record<string, number> = {};
  const cropYields: Record<string, number> = {};

  userLogs?.forEach((log) => {
    cropCounts[log.crop] = (cropCounts[log.crop] || 0) + 1;
    cropExpenses[log.crop] = (cropExpenses[log.crop] || 0) + (log.cost || 0);
    cropYields[log.crop] = (cropYields[log.crop] || 0) + (log.quantity || 0);
  });

  const mostCommonActivity =
    Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "none";

  const mostWorkedCrop =
    Object.entries(cropCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    crops[0] ||
    "none";

  // Recent activities (last 5)
  const recentActivities =
    userLogs
      ?.slice(0, 5)
      .map(
        (log) =>
          `${log.activityType} - ${log.crop} (${new Date(log.date).toLocaleDateString("en-GB", { month: "short", day: "numeric" })})`,
      )
      .join(", ") || "none";

  // Build crop breakdown for context
  let cropBreakdown = "";
  if (Object.keys(cropExpenses).length > 0) {
    cropBreakdown = "\n\nPer-Crop Breakdown:";
    Object.keys(cropExpenses).forEach((crop) => {
      cropBreakdown += `\n- ${crop}: ${cropCounts[crop] || 0} activities, GH₵ ${cropExpenses[crop].toFixed(2)} expenses, ${cropYields[crop] || 0} kg yield`;
    });
  }

  return `
Farmer's Profile:
- Farm Name: ${farmName}
- Location: ${location}
- Farm Size: ${farmSize}
- Crops Growing: ${crops.join(", ") || "Not specified"}
- Experience Level: ${experience}

Activity Summary:
- Total Activities Logged: ${totalLogs}
- Total Expenses: GH₵ ${totalExpenses.toFixed(2)}
- Total Yield Harvested: ${totalYield} kg
- Most Common Activity: ${mostCommonActivity}
- Most Worked Crop: ${mostWorkedCrop}
- Recent Activities: ${recentActivities}${cropBreakdown}

IMPORTANT: Use this data ONLY when the farmer asks about THEIR farm (e.g., "my crops", "my expenses", "how am I doing"). For general farming questions, ignore this context and answer from your agricultural knowledge.
`.trim();
}
