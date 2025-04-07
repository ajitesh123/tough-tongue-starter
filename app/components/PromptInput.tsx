'use client';

import { useState } from 'react';
import { useCompletion } from '../utils/chat_completions';

export default function PromptInput() {
  const {
    prompt,
    setPrompt,
    response,
    generateCompletion,
    isLoading,
    error
  } = useCompletion("", "gpt-3.5-turbo", "You are a helpful assistant.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateCompletion();
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-1">
            Your question
          </label>
          <textarea
            id="prompt"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question here..."
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !prompt}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Submit'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error.message}
        </div>
      )}

      {response && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Response:</h2>
          <div className="p-4 bg-gray-100 rounded-md whitespace-pre-wrap">
            {response}
          </div>
        </div>
      )}
    </div>
  );
} 