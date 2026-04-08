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
    let prompt = `You are an expert culinary AI. Create a custom recipe and meal plan using these ingredients: ${ingredients}.`;
    if (dietary) prompt += ` The recipe MUST follow these dietary preferences: ${dietary}.`;
    if (goals) prompt += ` The recipe MUST align with these nutritional goals: ${goals}.`;
    prompt += `\n\nFormat the response beautifully in Markdown. Include a catchy title, a brief description, prep/cook time, a clear ingredients list (with measurements if possible), and step-by-step instructions. Finally, provide a short nutritional summary.`;

    const apiUrl = process.env.OXLO_API_URL || 'https://api.oxlo.ai/v1/chat/completions';
    
    // We use a base model name, if Oxlo requires a specific model, change it here or in .env
    const model = process.env.OXLO_MODEL || 'llama-3.2-3b';

    // We use Axios because Node's native fetch (Undici) sometimes encounters 
    // ConnectTimeoutErrors (IPv6 DNS resolution bugs) in Next.js development servers
    const response = await axios.post(apiUrl, {
      model: model,
      messages: [
        { role: 'system', content: 'You are a professional AI chef and meal planner.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      // 30 seconds timeout to be safe
      timeout: 30000 
    });

    const data = response.data;
    const recipeText = data.choices?.[0]?.message?.content || 'No recipe generated.';

    return NextResponse.json({ recipe: recipeText });
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
