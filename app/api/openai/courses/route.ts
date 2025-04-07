import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const { profession, level = "mid-level" } = await req.json();

    if (!profession) {
      return NextResponse.json(
        { error: "Profession is required" },
        { status: 400 }
      );
    }

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "user",
        content: `As an expert career coach who designs interactive training scenarios for professionals, please generate 5 course suggestions for a ${level} ${profession} who wants to improve their professional skills through interactive scenarios.
        
        Each course should focus on a specific interaction scenario relevant to this profession. For example, for a product manager, 
        it might be "Handling Engineering Pushback" which simulates a conversation with engineers who disagree with product priorities.
        
        Use the following format with tags in your response:

        <course>
          <title>Course Title Here</title>
          <description>A brief 1-2 sentence description of what skills this interaction scenario will help develop</description>
        </course>
        <course>
          <title>Second Course Title</title>
          <description>Description for the second course</description>
        </course>
        
        Create 5 courses following this pattern.

        Make the courses specific to the profession and highly relevant to real workplace challenges they face.`
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "o1-mini",
      messages,
    });

    const responseContent = completion.choices[0]?.message?.content || "";
    
    // Extract courses from XML-formatted response
    const courseRegex = /<course>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<description>([\s\S]*?)<\/description>[\s\S]*?<\/course>/g;
    
    const courses = [];
    let match;
    while ((match = courseRegex.exec(responseContent)) !== null) {
      courses.push({
        id: `course-${courses.length + 1}`,
        title: match[1].trim(),
        description: match[2].trim()
      });
    }

    if (courses.length === 0) {
      // Fallback in case parsing fails
      return NextResponse.json({
        courses: [
          {
            id: "course-1",
            title: "Effective Communication for " + profession,
            description: "Learn how to clearly articulate complex ideas to various stakeholders."
          },
          {
            id: "course-2", 
            title: "Conflict Resolution Strategies",
            description: "Practice navigating difficult conversations with colleagues and clients."
          },
          {
            id: "course-3",
            title: "Stakeholder Management",
            description: "Develop skills for managing expectations and building professional relationships."
          },
          {
            id: "course-4",
            title: "Leadership Development",
            description: "Practice leading teams through challenging situations and decisions."
          },
          {
            id: "course-5",
            title: "Negotiation Tactics",
            description: "Learn effective negotiation techniques for better outcomes in your role."
          }
        ]
      });
    }

    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error("Error in /api/openai/courses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 