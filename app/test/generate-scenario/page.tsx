'use client';

import { useState } from 'react';
import { getToughTongueEmbedUrl } from '@/app/utils/tough-tongue';

export default function GenerateScenarioPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  
  const [generatedScenario, setGeneratedScenario] = useState<any>(null);
  const [toughTongueResponse, setToughTongueResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'generate' | 'create'>('generate');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedScenario(null);
    setToughTongueResponse(null);

    try {
      const res = await fetch('/api/openai/generate-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate scenario');
      }

      setGeneratedScenario(data);
      setStep('create');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInToughTongue = async () => {
    if (!generatedScenario) return;
    
    setLoading(true);
    setError(null);
    setToughTongueResponse(null);

    try {
      const res = await fetch('/api/tough-tongue/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedScenario)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create scenario in Tough Tongue');
      }

      setToughTongueResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">AI Scenario Generator</h1>
      
      {step === 'generate' && (
        <>
          <p className="mb-6">Enter a course title and description to generate a scenario for Tough Tongue.</p>
          
          <form onSubmit={handleGenerate} className="space-y-4 max-w-2xl">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Course Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Scenario'}
            </button>
          </form>
        </>
      )}

      {step === 'create' && generatedScenario && (
        <div className="space-y-6 max-w-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated Scenario</h2>
            <button
              onClick={() => setStep('generate')}
              className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
            >
              Edit Course Info
            </button>
          </div>
          
          <div className="border rounded-md p-4 space-y-4 bg-gray-50">
            <div>
              <h3 className="font-medium text-gray-700">Name:</h3>
              <p>{generatedScenario.name}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">Description:</h3>
              <p>{generatedScenario.description}</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700">AI Instructions:</h3>
              <div className="whitespace-pre-wrap bg-white p-3 border rounded">
                {generatedScenario.ai_instructions}
              </div>
            </div>
          </div>
          
          <button
            onClick={handleCreateInToughTongue}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create in Tough Tongue'}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {toughTongueResponse && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Tough Tongue Scenario Created:</h2>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
            {JSON.stringify(toughTongueResponse, null, 2)}
          </pre>
          
          {toughTongueResponse.id && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Embed URL:</h3>
              <div className="p-4 bg-gray-100 rounded-md break-all">
                {getToughTongueEmbedUrl(toughTongueResponse.id)}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(getToughTongueEmbedUrl(toughTongueResponse.id))}
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy URL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 