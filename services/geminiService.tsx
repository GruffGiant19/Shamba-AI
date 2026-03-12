export const getChatResponse = async (
  userMessage: string,
  userProfile?: any,
  userLogs?: any[] // ✅ ADD LOGS PARAMETER
) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const message = userMessage.toLowerCase();
    const crops = userProfile?.farmProfile?.primaryCrops || [];
    const firstCrop = crops[0] || "maize";
    const location = userProfile?.farmProfile?.location || "your area";
    const farmSize = userProfile?.farmProfile?.farmSize || "your farm";

    // ✅ CALCULATE STATS FROM LOGS
    const totalLogs = userLogs?.length || 0;
    const totalExpenses = userLogs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
    const totalYield = userLogs?.reduce((sum, log) => sum + (log.quantity || 0), 0) || 0;
    const recentActivities = userLogs?.slice(0, 5) || [];
    
    // Most common activity
    const activityCounts: any = {};
    userLogs?.forEach(log => {
      activityCounts[log.activityType] = (activityCounts[log.activityType] || 0) + 1;
    });
    const mostCommonActivity = Object.entries(activityCounts)
      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'farming';

    // Most worked on crop
    const cropCounts: any = {};
    userLogs?.forEach(log => {
      cropCounts[log.crop] = (cropCounts[log.crop] || 0) + 1;
    });
    const mostWorkedCrop = Object.entries(cropCounts)
      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || firstCrop;

    // Smart responses based on keywords AND user data
    if (message.includes("maize") || message.includes("corn") || message.includes("yield")) {
      const maizeLogs = userLogs?.filter(log => log.crop.toLowerCase().includes('maize')) || [];
      const maizeExpenses = maizeLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
      
      return `Great question about maize! ${maizeLogs.length > 0 ? `I can see you've logged ${maizeLogs.length} maize activities with GH₵ ${maizeExpenses.toFixed(2)} in expenses so far. ` : ''}Here are some tips for improving maize yield:

**1. Soil Preparation**: Ensure deep plowing (20-30cm) and add organic manure 2 weeks before planting

**2. Proper Spacing**: Plant in rows 75cm apart with 25cm between plants

**3. Fertilizer**: Apply NPK 15-15-15 at planting, then top dress with urea after 4-6 weeks

**4. Weed Control**: Keep field weed-free especially in the first 6 weeks

**5. Water Management**: Ensure adequate moisture during tasseling and grain filling stages

Based on your farm size of ${farmSize}, you should aim for 4-6 tons per acre with good practices!`;
    }

    if (message.includes("tomato")) {
      const tomatoLogs = userLogs?.filter(log => log.crop.toLowerCase().includes('tomato')) || [];
      
      return `Tomatoes are a great crop! ${tomatoLogs.length > 0 ? `I see you've been working on tomatoes with ${tomatoLogs.length} logged activities. ` : ''}Here's advice for ${location}:

**1. Planting Season**: Best planted during cooler months (Sept-Nov or Feb-March)

**2. Nursery**: Start seeds in nursery 4-6 weeks before transplanting

**3. Spacing**: 60cm between rows, 45cm between plants

**4. Support**: Use stakes or cages as plants grow

**5. Pest Control**: Watch for early blight and aphids. Apply neem oil preventatively

**6. Watering**: Water regularly but avoid wetting leaves to prevent diseases

Expected yield: 15-20 tons per acre with proper care!`;
    }

    if (message.includes("fertilizer") || message.includes("fertiliser")) {
      const fertilizingLogs = userLogs?.filter(log => log.activityType === 'fertilizing') || [];
      const fertExpenses = fertilizingLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
      
      return `For your crops (${crops.join(", ")}), here's my fertilizer recommendation:

${fertilizingLogs.length > 0 ? `I noticed you've applied fertilizer ${fertilizingLogs.length} times, spending GH₵ ${fertExpenses.toFixed(2)} so far. ` : ''}

**Base Application (at planting):**
- NPK 15-15-15 or 20-10-10
- Rate: 2-3 bags per acre

**Top Dressing (4-6 weeks after planting):**
- CAN (Calcium Ammonium Nitrate) or Urea
- Rate: 1-2 bags per acre

**Organic Options:**
- Compost: 5-10 tons per acre
- Poultry manure: 2-3 tons per acre

**Pro Tip**: Always do a soil test first to know exact nutrient needs!`;
    }

    if (message.includes("expense") || message.includes("cost") || message.includes("money") || message.includes("budget")) {
      return `Let me help you with farm expenses! 💰

${totalLogs > 0 ? `
**Your Current Stats:**
- Total expenses: GH₵ ${totalExpenses.toFixed(2)}
- Total activities logged: ${totalLogs}
- Most worked on: ${mostWorkedCrop}

**Breakdown:**
Your biggest activities are ${mostCommonActivity}. ${totalExpenses > 0 ? `You're averaging GH₵ ${(totalExpenses / totalLogs).toFixed(2)} per activity.` : ''}
` : 'Start logging your activities to track expenses!'}

**Tips to Reduce Costs:**
1. Buy inputs in bulk during off-season
2. Use organic alternatives where possible
3. Join farmer cooperatives for group discounts
4. Keep detailed records to identify waste

Would you like specific advice on any expense category?`;
    }

    if (message.includes("progress") || message.includes("how am i doing") || message.includes("performance")) {
      if (totalLogs === 0) {
        return `You haven't started logging activities yet! 📊

Start tracking your farm work to see:
- Expense trends
- Crop performance
- Activity patterns
- AI-powered insights

Tap the Logs tab and hit the + button to get started!`;
      }

      return `Great question! Let me analyze your farm performance: 📊

**Activity Summary:**
- Total activities: ${totalLogs}
- Most common activity: ${mostCommonActivity.charAt(0).toUpperCase() + mostCommonActivity.slice(1)}
- Most worked crop: ${mostWorkedCrop}

**Financial Overview:**
- Total expenses: GH₵ ${totalExpenses.toFixed(2)}
- Total yield: ${totalYield} kg

**Recent Work:**
${recentActivities.slice(0, 3).map((log: any) => 
  `• ${new Date(log.date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}: ${log.activityType} - ${log.crop}`
).join('\n')}

**Insights:**
${totalYield > 0 ? `You're harvesting! That's great progress. ` : 'Consider logging harvest data to track your returns. '}
${totalLogs > 10 ? 'You\'re doing excellent at tracking your farm activities!' : 'Keep logging to unlock more insights!'}

Keep up the good work! 🌱`;
    }

    if (message.includes("pest") || message.includes("disease") || message.includes("deal")) {
      return `Pest management for ${mostWorkedCrop}:

**Common Pests:**
- Fall armyworm (maize): Use Bt-based pesticides
- Aphids: Neem oil spray
- Cutworms: Apply furadan at planting

**Prevention Tips:**
1. Crop rotation to break pest cycles
2. Remove crop residue after harvest
3. Scout fields weekly
4. Plant trap crops around main field
5. Maintain field hygiene

**Organic Solutions:**
- Neem oil spray (50ml per 20L water)
- Wood ash around plant base
- Intercrop with strong-smelling plants

For severe infestations, consult your local agro-vet!`;
    }

    if (message.includes("plant") || message.includes("when")) {
      return `Planting calendar for ${location}:

**Main Season (April-July):**
- Maize, beans, sorghum
- Plant at onset of rains

**Short Season (Sept-Dec):**
- Vegetables, tomatoes
- Requires irrigation or reliable rainfall

Your season starts in **${userProfile?.experience?.seasonStart || "March"}**, so plan accordingly!

**Pro Tips:**
- Plant early in the season for better yields
- Monitor weather forecasts
- Have seeds ready 2 weeks before planting
- Prepare land in advance`;
    }

    if (message.includes("water") || message.includes("irrigation")) {
      return `Water management tips for ${farmSize}:

**Critical Watering Stages:**
1. Germination (0-2 weeks)
2. Flowering/tasseling
3. Grain filling

**Irrigation Methods:**
- Drip irrigation: Most efficient, saves 50% water
- Furrow irrigation: Traditional, easy to implement
- Sprinkler: Good for large areas

**Water Conservation:**
- Mulch to reduce evaporation
- Water early morning or evening
- Use ridges to capture rainwater

Consider investing in a drip system for high-value crops!`;
    }

    // Default response with personalized data
    return `Thanks for asking about "${userMessage}"!

${totalLogs > 0 ? `
**Your Farm Snapshot:**
- ${totalLogs} activities logged
- ${crops.join(", ")} being cultivated
- GH₵ ${totalExpenses.toFixed(2)} in expenses tracked
- ${totalYield} kg harvested so far

Your most active work: ${mostCommonActivity}
` : `
**Your Farm Profile:**
- Farm: ${userProfile?.farmProfile?.farmName || "Your farm"}
- Crops: ${crops.join(", ") || "Not specified"}
- Location: ${location}
`}

I can help with:
✓ Crop-specific growing tips
✓ Fertilizer recommendations
✓ Pest and disease management
✓ Planting calendars
✓ Irrigation advice
✓ Farm expense tracking
✓ Performance analysis

Could you be more specific about what aspect you'd like advice on?`;
  } catch (error: any) {
    console.error("AI Error:", error);
    throw new Error("Failed to generate response");
  }
};