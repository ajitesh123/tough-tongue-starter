/**
 * Utility functions for localStorage management
 */

import { Course } from '../utils/courses';

// Storage keys 
export const STORAGE_KEYS = {
  COURSES: 'tough_tongue_courses',
};

/**
 * Save data to localStorage
 * @param key Storage key
 * @param data Data to save
 */
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

/**
 * Retrieve data from localStorage
 * @param key Storage key
 * @returns Retrieved data or null if none exists
 */
export function getFromStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }
  return null;
}

/**
 * Course-specific storage functions
 */

/**
 * Save courses to localStorage
 * @param courses Array of courses to save
 */
export function saveCourses(courses: Course[]): void {
  saveToStorage(STORAGE_KEYS.COURSES, courses);
}

/**
 * Retrieve saved courses from localStorage
 * @returns Array of saved courses or null if none exist
 */
export function getSavedCourses(): Course[] | null {
  return getFromStorage<Course[]>(STORAGE_KEYS.COURSES);
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