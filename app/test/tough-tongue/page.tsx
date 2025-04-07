'use client';

import { useState } from 'react';
import { getToughTongueEmbedUrl } from '@/app/utils/tough-tongue';

export default function ToughTonguePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    user_friendly_description: '',
    ai_instructions: ''
  });
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/test/tough-tongue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Tough Tongue API Test</h1>
      <p className="mb-6">Create a new scenario using the Tough Tongue API.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Scenario Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Internal Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="user_friendly_description" className="block text-sm font-medium mb-1">User Friendly Description (Optional)</label>
          <input
            type="text"
            id="user_friendly_description"
            name="user_friendly_description"
            value={formData.user_friendly_description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Optional - will be skipped if empty"
          />
        </div>

        <div>
          <label htmlFor="ai_instructions" className="block text-sm font-medium mb-1">AI Instructions</label>
          <textarea
            id="ai_instructions"
            name="ai_instructions"
            value={formData.ai_instructions}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Scenario'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <pre className="p-4 bg-gray-100 rounded-md overflow-auto">
            {JSON.stringify(response, null, 2)}
          </pre>
          
          {response.id && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Embed URL:</h3>
              <div className="p-4 bg-gray-100 rounded-md break-all">
                {getToughTongueEmbedUrl(response.id)}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(getToughTongueEmbedUrl(response.id))}
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