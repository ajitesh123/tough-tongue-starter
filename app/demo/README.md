# Tough Tongue Demo Application

This folder contains a Next.js demo application for Tough Tongue AI, designed to showcase conversational practice capabilities.

## Component Structure

### Main Components

- `page.tsx` - The main demo page that orchestrates the workflow
- `components/ScenarioCreator.tsx` - Component for creating practice scenarios
- `components/ConversationDemo.tsx` - Component for embedding the conversation interface

## Flow

1. **Create Scenario**: Users can create a practice scenario by describing the conversation they want to practice or selecting one of the predefined quick scenarios.

2. **Practice Conversation**: Once a scenario is created, users are presented with an embedded Tough Tongue conversation interface where they can practice the scenario using their camera and microphone.

## API Integration

The demo integrates with two APIs:

1. **OpenAI API** (`/api/openai/generate-scenario`)
   - Generates scenario content based on user input
   - Returns structured data for the scenario

2. **Tough Tongue API** (`/api/tough-tongue/scenarios`)
   - Creates scenarios in the Tough Tongue platform
   - Returns a scenario ID used for embedding the conversation interface

## Embedding

The conversation interface is embedded using an iframe that points to the Tough Tongue application. The embed URL includes:
- The scenario ID
- Background configuration
- Precheck skip parameter

## Development

To modify this demo:

1. Edit component files individually to maintain code organization
2. Test API integrations by checking the browser console for errors
3. Style changes should be made using the Tailwind CSS classes 