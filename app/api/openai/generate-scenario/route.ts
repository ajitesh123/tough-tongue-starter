import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: `You are an expert at creating conversational AI training scenarios. 
          Your task is to generate realistic and challenging practice scenarios for users 
          to improve their communication skills. The scenarios should be detailed, specific, 
          and provide clear guidance for the AI on how to act in the role-play.
          
          Create a Tough Tongue AI practice scenario based on this course:
          
          Title: ${title}
          Description: ${description}
          
          Generate a scenario with these details formatted exactly as shown below:
          
          <scenario>
            <name>Scenario Name Here</name>
            <description>Concise description for your team about the scenario purpose</description>
            <ai_instructions>Detailed instructions for the AI on how to behave, what persona to adopt, 
            tone, knowledge level, communication style, concerns, objections, and how the AI should respond to the user</ai_instructions>
          </scenario>
          
          The AI instructions should be very detailed with at least 4-5 paragraphs explaining the persona, 
          situation, and how to interact with the user.`
        }
      ]
    });

    const responseContent = response.choices[0]?.message?.content || "";
    
    // Extract scenario from XML-formatted response
    const nameMatch = responseContent.match(/<name>([\s\S]*?)<\/name>/);
    const descriptionMatch = responseContent.match(/<description>([\s\S]*?)<\/description>/);
    const aiInstructionsMatch = responseContent.match(/<ai_instructions>([\s\S]*?)<\/ai_instructions>/);
    
    if (!nameMatch || !descriptionMatch || !aiInstructionsMatch) {
      console.error('Failed to parse response:', responseContent);
      return NextResponse.json(
        { error: 'Failed to parse scenario data from the response' },
        { status: 500 }
      );
    }
    
    const scenarioData = {
      name: nameMatch[1].trim(),
      description: descriptionMatch[1].trim(),
      ai_instructions: aiInstructionsMatch[1].trim()
    };

    return NextResponse.json(scenarioData);
  } catch (error) {
    console.error('Error generating scenario data:', error);
    return NextResponse.json(
      { error: 'An error occurred while generating scenario data' },
      { status: 500 }
    );
  }
} 