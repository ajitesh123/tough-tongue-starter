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

// Storage key for courses in localStorage
const COURSES_STORAGE_KEY = 'tough_tongue_courses';

/**
 * Save courses to localStorage
 * @param courses Array of courses to save
 */
export function saveCourses(courses: Course[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  }
}

/**
 * Retrieve saved courses from localStorage
 * @returns Array of saved courses or null if none exist
 */
export function getSavedCourses(): Course[] | null {
  if (typeof window !== 'undefined') {
    const savedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    return savedCourses ? JSON.parse(savedCourses) : null;
  }
  return null;
}

/**
 * Update a specific course in the saved courses
 * @param courseId ID of the course to update
 * @param courseData Updated course data
 * @returns Boolean indicating success
 */
export function updateSavedCourse(courseId: string, courseData: Partial<Course>): boolean {
  if (typeof window !== 'undefined') {
    const courses = getSavedCourses();
    if (!courses) return false;
    
    const updatedCourses = courses.map(course => 
      course.id === courseId ? { ...course, ...courseData } : course
    );
    
    saveCourses(updatedCourses);
    return true;
  }
  return false;
} 