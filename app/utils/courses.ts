/**
 * Utility functions for fetching and managing course data
 */

/**
 * Interface for course data structure
 */
export interface Course {
  id: string;
  title: string;
  description: string;
  scenarioId?: string;
  embedUrl?: string;
}

/**
 * Fetches course suggestions based on the user's profession
 * @param profession The user's profession
 * @returns Array of course suggestions
 */
export async function fetchCourseSuggestions(profession: string): Promise<Course[]> {
  try {
    const response = await fetch('/api/openai/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profession }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch course suggestions');
    }
    
    const data = await response.json();
    return data.courses;
  } catch (error) {
    console.error('Error fetching course suggestions:', error);
    
    // Return default courses as fallback
    return [
      {
        id: "course-1",
        title: `Effective Communication for ${profession}`,
        description: "Learn how to clearly articulate complex ideas to various stakeholders."
      },
      {
        id: "course-2", 
        title: "Conflict Resolution Strategies",
        description: "Practice navigating difficult conversations with colleagues and clients."
      },
      {
        id: "course-3",
        title: "Stakeholder Management",
        description: "Develop skills for managing expectations and building professional relationships."
      },
      {
        id: "course-4",
        title: "Leadership Development",
        description: "Practice leading teams through challenging situations and decisions."
      },
      {
        id: "course-5",
        title: "Negotiation Tactics",
        description: "Learn effective negotiation techniques for better outcomes in your role."
      }
    ];
  }
}

// Storage functionality has been moved to app/utils/storage.ts 