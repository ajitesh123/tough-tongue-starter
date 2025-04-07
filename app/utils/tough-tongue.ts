/**
 * Generate a Tough Tongue embed URL from a scenario ID
 * @param scenarioId The ID of the Tough Tongue scenario
 * @returns Formatted embed URL
 */
export function getToughTongueEmbedUrl(scenarioId: string): string {
  return `https://app.toughtongueai.com/embed/${scenarioId}?bg=black&skipPrecheck=true`;
}

/**
 * Generate scenario content using OpenAI based on course details
 * @param title Course title
 * @param description Course description
 * @returns Generated scenario data
 */
export async function generateScenarioContent(title: string, description: string) {
  try {
    const response = await fetch('/api/openai/generate-scenario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate scenario content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating scenario content:', error);
    throw error;
  }
}

/**
 * Create a Tough Tongue scenario using the API
 * @param scenarioData Scenario data to create
 * @returns Created scenario including the ID
 */
export async function createToughTongueScenario(scenarioData: {
  name: string;
  description: string;
  ai_instructions: string;
  user_friendly_description?: string;
}) {
  try {
    const response = await fetch('/api/tough-tongue/scenarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scenarioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create Tough Tongue scenario');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Tough Tongue scenario:', error);
    throw error;
  }
}

/**
 * Process a course to generate a Tough Tongue scenario and get the embed URL
 * @param course Course data with title and description
 * @returns The processed course with scenarioId and embedUrl
 */
export async function processCourseToScenario(course: {
  id: string;
  title: string;
  description: string;
}) {
  // Step 1: Generate scenario content with OpenAI
  const scenarioContent = await generateScenarioContent(course.title, course.description);
  
  // Step 2: Create the scenario in Tough Tongue
  const scenarioData = await createToughTongueScenario({
    name: scenarioContent.name,
    description: scenarioContent.description,
    ai_instructions: scenarioContent.ai_instructions,
    user_friendly_description: course.description,
  });
  
  // Step 3: Return the course with the scenario ID and embed URL
  return {
    ...course,
    scenarioId: scenarioData.id,
    embedUrl: getToughTongueEmbedUrl(scenarioData.id),
  };
}