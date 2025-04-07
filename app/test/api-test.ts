import { getCompletion } from '@/app/utils/chat_completions';

/**
 * This is a test script for the OpenAI completion API.
 * It's meant to be imported and run in a Node.js environment.
 * 
 * Example usage:
 * ```
 * import { testCompletion } from '@/app/test/api-test';
 * 
 * async function runTest() {
 *   const result = await testCompletion("What is the capital of France?");
 *   console.log(result);
 * }
 * 
 * runTest();
 * ```
 */
export async function testCompletion(prompt: string = "Hello, how are you?") {
  try {
    console.log(`Testing completion with prompt: "${prompt}"`);
    const result = await getCompletion(prompt);
    console.log("Response:", result);
    return result;
  } catch (error) {
    console.error("Test failed:", error);
    throw error;
  }
}

// For testing in Next.js API routes
export async function testCompletionHandler(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = await getCompletion(prompt);
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 