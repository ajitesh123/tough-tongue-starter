import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Course } from '../utils/courses';

interface CourseStore {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  updateCourse: (courseId: string, courseData: Partial<Course>) => boolean;
  clearCourses: () => void;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      setCourses: (courses) => set({ courses }),
      updateCourse: (courseId, courseData) => {
        const { courses } = get();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        
        if (courseIndex === -1) return false;
        
        const updatedCourses = [...courses];
        updatedCourses[courseIndex] = { ...updatedCourses[courseIndex], ...courseData };
        
        set({ courses: updatedCourses });
        return true;
      },
      clearCourses: () => set({ courses: [] })
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
); 