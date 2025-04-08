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