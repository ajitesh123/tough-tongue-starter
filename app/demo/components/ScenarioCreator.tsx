/**
 * ScenarioCreator.tsx
 * 
 * This component handles the creation of practice scenarios for Tough Tongue AI.
 * It allows users to:
 * 1. Enter a custom scenario description
 * 2. Select from predefined quick scenarios
 * 3. Generate and create the scenario via API calls
 * 
 * The component uses a two-step API process:
 * - First calls OpenAI to generate scenario details
 * - Then creates the scenario in Tough Tongue and returns an ID
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScenarioCreatorProps {
  onScenarioCreated: (id: string) => void;  // Callback when scenario is successfully created
}

/**
 * Text input component for entering scenario topic description
 */
function TopicForm({ topic, setTopic }: { topic: string; setTopic: (value: string) => void }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2">Scenario Topic</label>
      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        rows={4}
        placeholder="Describe the conversation you want to practice..."
      />
    </div>
  );
}

/**
 * Displays quick-select buttons for predefined scenarios
 */
function QuickScenarioButtons({ scenarios, onSelect }: { 
  scenarios: Array<{ name: string; topic: string }>; 
  onSelect: (topic: string) => void 
}) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium mb-2">Quick Scenarios</p>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button 
            key={scenario.name} 
            className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
            onClick={() => onSelect(scenario.topic)}
          >
            {scenario.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Submit button with loading state handling
 */
function CreateButton({ onClick, isDisabled, isLoading }: { 
  onClick: () => void; 
  isDisabled: boolean; 
  isLoading: boolean 
}) {
  return (
    <button 
      onClick={onClick} 
      disabled={isDisabled}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Creating Scenario...' : 'Create Scenario'}
    </button>
  );
}

export function ScenarioCreator({ onScenarioCreated }: ScenarioCreatorProps) {
  // State management
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Predefined quick scenarios for common practice situations
  const quickScenarios = [
    { name: "Job Interview", topic: "Practice answering tough interview questions for a software developer role" },
    { name: "Sales Pitch", topic: "Practice pitching a SaaS product to a potential client" },
    { name: "Performance Review", topic: "Practice having a performance review discussion with an employee" }
  ];

  /**
   * Sets the topic field to the selected predefined scenario
   */
  const handleQuickScenario = (scenarioTopic: string) => {
    setTopic(scenarioTopic);
  };

  /**
   * Main scenario creation workflow:
   * 1. Generate AI scenario content using OpenAI
   * 2. Create scenario in Tough Tongue platform
   * 3. Return the scenario ID on success
   */
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
      
      if (!genResponse.ok) throw new Error('Failed to generate scenario');
      const scenarioContent = await genResponse.json();
      
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
      
      if (!createResponse.ok) throw new Error('Failed to create scenario');
      const result = await createResponse.json();
      
      // Step 3: Pass the created scenario ID back to parent component
      onScenarioCreated(result.id);
    } catch (error) {
      console.error('Error creating scenario:', error);
      alert('Failed to create scenario. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Component render structure with sub-components for modularity
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a Practice Scenario</CardTitle>
      </CardHeader>
      <CardContent>
        <TopicForm topic={topic} setTopic={setTopic} />
        <QuickScenarioButtons scenarios={quickScenarios} onSelect={handleQuickScenario} />
        <CreateButton 
          onClick={handleCreateScenario} 
          isDisabled={!topic || isGenerating} 
          isLoading={isGenerating} 
        />
      </CardContent>
    </Card>
  );
} 