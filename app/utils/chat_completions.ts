"use client";

import { useState } from 'react';
import { OpenAI } from 'openai';

/**
 * A utility function to send a prompt to the OpenAI API and get a response.
 * @param prompt The user's input prompt
 * @param model The OpenAI model to use (defaults to "gpt-3.5-turbo")
 * @param systemPrompt Optional system prompt to set context
 * @returns The generated text response
 */
export async function getCompletion(
  prompt: string,
  model: string = "o1-mini",
  systemPrompt?: string
): Promise<string> {
  try {
    const messages = [
      ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
      { role: "user", content: prompt }
    ];

    const response = await fetch("/api/openai/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const completion = await response.json();
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error getting completion:", error);
    throw error;
  }
}

/**
 * A React hook to use OpenAI completions in components
 * @param initialPrompt Optional initial prompt
 * @param model The OpenAI model to use (defaults to "gpt-3.5-turbo")
 * @param systemPrompt Optional system prompt to set context
 * @returns Object with completion state and functions
 */
export function useCompletion(
  initialPrompt?: string,
  model: string = "o1-mini",
  systemPrompt?: string
) {
  const [prompt, setPrompt] = useState<string>(initialPrompt || "");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const generateCompletion = async (newPrompt?: string) => {
    const promptToUse = newPrompt || prompt;
    if (!promptToUse) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getCompletion(promptToUse, model, systemPrompt);
      setResponse(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    response,
    generateCompletion,
    isLoading,
    error,
  };
}
