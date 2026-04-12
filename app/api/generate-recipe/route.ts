import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const { ingredients, dietary, goals } = await req.json();

    if (!ingredients) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
    }

    const apiKey = process.env.OXLO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OXLO_API_KEY environment variable is not configured.' },
        { status: 500 }
      );
    }

    // Build the prompt for the AI
    let prompt = `A user wants a recipe using ONLY these ingredients: ${ingredients}.
    
    CRITICAL RULES:
    1. Use as many of the provided ingredients as possible.
    2. DO NOT add any ingredients that are not in the list, unless they are very basic pantry staples (like salt, pepper, oil, or water).
    3. If an ingredient is not listed (e.g., no chicken, no pasta), do NOT include it in the recipe.
    4. The recipe must be realistic and high-quality despite the limitations.`;

    if (dietary) prompt += `\n\nDietary Preferences: ${dietary}. (The recipe MUST follow these)`;
    if (goals) prompt += `\n\nNutritional Goals: ${goals}. (The recipe MUST align with these)`;
    
    prompt += `\n\nFormat the response beautifully in Markdown. Include a catchy title, a brief description, prep/cook time, a clear ingredients list, and step-by-step instructions. Finally, provide a short nutritional summary.`;

    const apiUrl = process.env.OXLO_API_URL || 'https://api.oxlo.ai/v1/chat/completions';

    const model = process.env.OXLO_MODEL || 'llama-3.2-3b';

    const response = await axios.post(apiUrl, {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a professional "Fridge Raider" chef. Your goal is to create delicious meals using ONLY the ingredients the user provides. You never add outside ingredients except for minimal staples like salt, pepper, and cooking oil.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      timeout: 30000
    });

    const data = response.data;
    const recipeText = data.choices?.[0]?.message?.content || 'No recipe generated.';

    // NEW: Generate only the main image for the recipe
    let imageUrl = '';
    try {
      const titleMatch = recipeText.match(/#\s+(.*)/);
      let recipeTitle = titleMatch ? titleMatch[1] : 'Delicious home-cooked meal';
      recipeTitle = recipeTitle.replace(/[\*#_~`\[\]]/g, '').trim();

      // Improve accuracy by including main ingredients and context in the image prompt
      const imagePrompt = `Professional gourmet food photography of ${recipeTitle}. Featuring ${ingredients.split(',').slice(0, 3).join(', ')}. ${dietary ? `Style: ${dietary}.` : ''} High quality, studio lighting, appetizing plating, 4k, delicious, sharp focus, cinematic.`;

      const imageResponse = await axios.post('https://api.oxlo.ai/v1/images/generations', {
        model: 'flux.1-schnell',
        prompt: imagePrompt,
        n: 1,
        size: '1024x1024',
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        timeout: 20000
      });

      const imgData = imageResponse.data.data?.[0];
      imageUrl = imgData?.url || (imgData?.b64_json ? `data:image/png;base64,${imgData.b64_json}` : '');
    } catch (imageError: any) {
      console.error('Image Generation Error:', imageError.message);
    }

    return NextResponse.json({
      recipe: recipeText,
      imageUrl: imageUrl
    });
  } catch (error: any) {
    console.error('Server error:', error.message || error);

    // Check if it's an API specific error
    if (error.response) {
      console.error('Oxlo API Error Response:', error.response.status, error.response.data);
      return NextResponse.json(
        { error: `Oxlo API error: ${error.response.status} - ${JSON.stringify(error.response.data)}` },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: `Connection failed: ${error.message}` },
      { status: 500 }
    );
  }
}
