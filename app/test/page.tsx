'use client';

import Link from 'next/link';
import PromptInput from '@/app/components/PromptInput';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Test Pages</h1>
      
      <div className="space-y-6 mb-12">
        <div className="space-y-4">
          <Link href="/test/tough-tongue" className="block p-4 border rounded-md hover:bg-gray-50">
            <h2 className="text-xl font-semibold">Tough Tongue API Test</h2>
            <p className="text-gray-600">Test creating scenarios directly using the Tough Tongue API</p>
          </Link>
          
          <Link href="/test/generate-scenario" className="block p-4 border rounded-md hover:bg-gray-50">
            <h2 className="text-xl font-semibold">AI Scenario Generator</h2>
            <p className="text-gray-600">Generate scenarios from course data and create them in Tough Tongue</p>
          </Link>
        </div>
      </div>
      
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">OpenAI Completion Test</h2>
        <p className="mb-6">
          Enter a prompt below to test the OpenAI completion functionality.
        </p>
        <PromptInput />
      </div>
    </div>
  );
} 