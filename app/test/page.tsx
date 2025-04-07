import PromptInput from '@/app/components/PromptInput';

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">OpenAI Completion Test</h1>
      <p className="mb-6">
        Enter a prompt below to test the OpenAI completion functionality.
      </p>
      <PromptInput />
    </div>
  );
} 