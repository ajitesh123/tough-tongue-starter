# Tough Tongue AI - Project Walkthrough

This document provides a comprehensive overview of the Tough Tongue AI project, a Next.js application that allows users to create and practice conversational scenarios using AI.

## Repository Structure

```
tough-tongue-starter/
├── app/                      # Next.js application code
│   ├── api/                  # API endpoints
│   │   ├── openai/           # OpenAI API endpoints
│   │   └── tough-tongue/     # Tough Tongue AI API endpoints
│   ├── course/               # Course-related pages
│   ├── demo/                 # Demo page and components
│   ├── store/                # State management
│   ├── utils/                # Utility functions
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Home page
├── components/               # Shared UI components
│   ├── course/               # Course-specific components
│   ├── ui/                   # UI component library
│   └── [Component].tsx       # Individual components
├── lib/                      # Helper libraries and utilities
├── public/                   # Static files
├── .env                      # Environment variables
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies
└── tailwind.config.ts        # Tailwind CSS configuration
```

## Key Technologies

- **Next.js**: Framework for building React applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Clerk**: Authentication provider
- **OpenAI**: AI model for scenario generation
- **Zustand**: State management

## Critical Files and Components

### Core Application Structure

#### `app/layout.tsx`

The root layout component that wraps all pages, includes global styles, and Clerk authentication provider.

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import { ClerkProvider } from "@clerk/nextjs";

// Font configuration
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Course Creator - Tough Tongue AI",
  description: "Create your course with Tough Tongue AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

#### `app/page.tsx`

The home page component that introduces the application and provides entry points to create scenarios.

```tsx
// Simplified version of app/page.tsx
export default function Home() {
  const [professionDialogOpen, setProfessionDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [profession, setProfession] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const handleGetStarted = () => {
    setProfessionDialogOpen(true);
  };

  const handleProfessionSubmit = async (profession: string) => {
    // Profession submission logic
    setProfession(profession);
    // Fetch course suggestions
  };

  const handleCoursesSubmit = (editedCourses: Course[]) => {
    // Course submission logic
    window.location.href = "/course";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <main>
        <Header />
        <CourseModules />
        <CTAButtons onGetStarted={handleGetStarted} />
      </main>
      <Footer />
      
      {/* Dialogs for profession and course selection */}
      <ProfessionDialog
        open={professionDialogOpen}
        onOpenChange={setProfessionDialogOpen}
        onSubmit={handleProfessionSubmit}
      />
      
      <CourseDialog
        open={courseDialogOpen}
        onOpenChange={setCourseDialogOpen}
        courses={courses}
        isLoading={isLoadingCourses}
        onSubmit={handleCoursesSubmit}
      />
    </div>
  );
}
```

### Demo Functionality

#### `app/demo/page.tsx`

The demo page allows users to create and interact with practice scenarios.

```tsx
// app/demo/page.tsx
'use client';

import { useState } from 'react';
import { ScenarioCreator } from './components/ScenarioCreator';
import { ConversationDemo } from './components/ConversationDemo';

export default function DemoPage() {
  const [step, setStep] = useState(1);
  const [scenarioId, setScenarioId] = useState<string | null>(null);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Tough Tongue AI Demo</h1>
      
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button 
            className={`py-2 px-4 font-medium ${step === 1 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setStep(1)}
          >
            Create Scenario
          </button>
          <button 
            className={`py-2 px-4 font-medium ${step === 2 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => scenarioId && setStep(2)}
            disabled={!scenarioId}
          >
            Try Conversation
          </button> 
        </div>
      </div>

      {step === 1 && (
        <ScenarioCreator 
          onScenarioCreated={(id) => {
            setScenarioId(id);
            setStep(2);
          }} 
        />
      )}

      {step === 2 && scenarioId && (
        <ConversationDemo scenarioId={scenarioId} />
      )}
    </div>
  );
}
```

#### `app/demo/components/ScenarioCreator.tsx`

This component handles the creation of practice scenarios:

```tsx
// Simplified version of ScenarioCreator.tsx
export function ScenarioCreator({ onScenarioCreated }: ScenarioCreatorProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Predefined quick scenarios for common practice situations
  const quickScenarios = [
    { name: "Job Interview", topic: "Practice answering tough interview questions for a software developer role" },
    { name: "Sales Pitch", topic: "Practice pitching a SaaS product to a potential client" },
    { name: "Performance Review", topic: "Practice having a performance review discussion with an employee" }
  ];

  const handleCreateScenario = async () => {
    if (!topic) return;
    
    setIsGenerating(true);
    try {
      // Step 1: Generate the AI scenario content with OpenAI
      const genResponse = await fetch('/api/openai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: "Quick Demo", 
          description: topic 
        })
      });
      
      // Step 2: Create scenario in Tough Tongue platform
      const createResponse = await fetch('/api/tough-tongue/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: scenarioContent.name,
          description: scenarioContent.description,
          ai_instructions: scenarioContent.ai_instructions,
          user_friendly_description: topic
        })
      });
      
      // Return scenario ID to parent component
      onScenarioCreated(result.id);
    } catch (error) {
      console.error('Error creating scenario:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a Practice Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Form components for scenario creation */}
      </CardContent>
    </Card>
  );
}
```

#### `app/demo/components/ConversationDemo.tsx`

This component embeds the interactive AI conversation interface:

```tsx
export function ConversationDemo({ scenarioId }: ConversationDemoProps) {
  const getEmbedUrl = (id: string) => {
    return `https://app.toughtongueai.com/embed/${id}?bg=black&skipPrecheck=true`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Practice Conversation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-gray-100 p-4">
          <p className="text-sm text-gray-600">
            <strong>Instructions:</strong> This embedded conversation will use your microphone and camera.
            Click "Start" when prompted and begin speaking naturally to the AI.
          </p>
        </div>
        
        <div className="w-full" style={{ minHeight: "700px" }}>
          <iframe
            src={getEmbedUrl(scenarioId)}
            title="Tough Tongue Conversation"
            width="100%"
            height="700px"
            frameBorder="0"
            allow="microphone; camera; display-capture"
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
```

### API Routes

#### `app/api/openai/generate-scenario/route.ts`

This API endpoint uses OpenAI to generate practice scenario content:

```tsx
// app/api/openai/generate-scenario/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    
    // Input validation
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Call OpenAI API to generate scenario content
    const response = await openai.chat.completions.create({
      model: 'o1-mini',
      messages: [
        {
          role: 'user',
          content: `You are an expert at creating conversational AI training scenarios...
          Create a Tough Tongue AI practice scenario based on this course:
          
          Title: ${title}
          Description: ${description}
          
          Generate a scenario with these details formatted exactly as shown below...`
        }
      ]
    });

    // Extract and process the generated content
    const responseContent = response.choices[0]?.message?.content || "";
    const nameMatch = responseContent.match(/<n>([\s\S]*?)<\/name>/);
    const descriptionMatch = responseContent.match(/<description>([\s\S]*?)<\/description>/);
    const aiInstructionsMatch = responseContent.match(/<ai_instructions>([\s\S]*?)<\/ai_instructions>/);
    
    // Return the structured scenario data
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
```

## Key Features and Workflows

### 1. Scenario Creation Flow

1. User enters a scenario description or selects from predefined options
2. The application calls OpenAI to generate detailed scenario content
3. The generated content is used to create a scenario in the Tough Tongue AI platform
4. A unique scenario ID is returned for embedding the conversation

### 2. Interactive Conversation Practice

1. Once a scenario is created, the user can practice the conversation
2. The conversation is embedded via an iframe from the Tough Tongue AI platform
3. The user interacts with the AI using their microphone and camera
4. The AI responds based on the scenario instructions

### 3. Course Creation

1. Users can specify their profession to get personalized course suggestions
2. The application uses OpenAI to generate relevant course content
3. Users can review and customize the suggested courses
4. Courses are saved and available for practice

## Authentication and User Management

The application uses Clerk for authentication and user management, as seen in the `app/layout.tsx` file. This provides:

- User sign-up and sign-in functionality
- User profile management
- Authentication state across the application

## UI Components

The application uses a component library built with Tailwind CSS, providing:

- Cards for structured content display
- Buttons and form controls
- Dialog components for user interactions
- Layout elements for responsive design

## Deployment and Environment Configuration

The application requires the following environment variables:

- `OPENAI_API_KEY`: For accessing the OpenAI API
- `TOUGH_TONGUE_API_KEY`: For accessing the Tough Tongue AI platform
- Clerk authentication keys

## Conclusion

Tough Tongue AI is a Next.js application that enables users to create and practice conversational scenarios using AI technology. The application integrates with OpenAI for content generation and the Tough Tongue AI platform for interactive conversation practice. The codebase follows modern React practices with TypeScript for type safety and Tailwind CSS for styling. 