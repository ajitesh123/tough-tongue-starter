'use client';

import Link from 'next/link';

export default function TestIndex() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Test Pages</h1>
      <p className="mb-6">Select a test to run:</p>
      
      <div className="space-y-4">
        <Link href="/test/tough-tongue" className="block p-4 border rounded-md hover:bg-gray-50">
          <h2 className="text-xl font-semibold">Tough Tongue API Test</h2>
          <p className="text-gray-600">Test creating scenarios directly using the Tough Tongue API</p>
        </Link>
        
        <Link href="/test/generate-scenario" className="block p-4 border rounded-md hover:bg-gray-50">
          <h2 className="text-xl font-semibold">AI Scenario Generator</h2>
          <p className="text-gray-600">Generate scenarios from course data and create them in Tough Tongue</p>
        </Link>
        
        <Link href="/test" className="block p-4 border rounded-md hover:bg-gray-50">
          <h2 className="text-xl font-semibold">OpenAI Completion Test</h2>
          <p className="text-gray-600">Test OpenAI completions functionality</p>
        </Link>
      </div>
    </div>
  );
} 