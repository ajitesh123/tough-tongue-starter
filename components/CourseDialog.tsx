"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processCourseToScenario } from "@/app/utils/tough-tongue";
import { saveCourses } from "@/app/store/localStorageUtils";

export interface Course {
  id: string;
  title: string;
  description: string;
  scenarioId?: string;
  embedUrl?: string;
}

interface CourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  isLoading: boolean;
  onSubmit: (courses: Course[]) => void;
}

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex flex-col items-center justify-center p-8 my-4">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
    <p className="mt-6 text-base text-gray-600 dark:text-gray-300 font-medium">Generating course suggestions...</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few moments</p>
  </div>
);

// Course card component for editing individual courses
interface CourseCardProps {
  course: Course;
  index: number;
  onChange: (index: number, field: 'title' | 'description', value: string) => void;
}

const CourseCard = ({ course, index, onChange }: CourseCardProps) => (
  <div className="bg-white dark:bg-black border border-black/30 dark:border-white/20 rounded-lg p-6 space-y-4">
    <div className="space-y-2">
      <Label htmlFor={`course-title-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Course Title
      </Label>
      <Input
        id={`course-title-${index}`}
        value={course.title}
        onChange={(e) => onChange(index, 'title', e.target.value)}
        className="font-medium text-base border border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary"
        placeholder="Enter course title"
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor={`course-desc-${index}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </Label>
      <Textarea
        id={`course-desc-${index}`}
        value={course.description}
        onChange={(e) => onChange(index, 'description', e.target.value)}
        className="min-h-24 text-sm border border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary resize-vertical"
        placeholder="Enter course description"
      />
    </div>
  </div>
);

// Main component
export default function CourseDialog({
  open,
  onOpenChange,
  courses,
  isLoading,
  onSubmit,
}: CourseDialogProps) {
  const [editedCourses, setEditedCourses] = useState<Course[]>(courses);
  const [processingScenarios, setProcessingScenarios] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Update local state when courses prop changes
  useEffect(() => {
    setEditedCourses(courses);
  }, [courses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProcessingScenarios(true);
      
      // Process each course to create ToughTongue scenarios
      const processedCourses: Course[] = [];
      const totalCourses = editedCourses.length;
      
      for (let i = 0; i < editedCourses.length; i++) {
        const course = editedCourses[i];
        try {
          // Only process course if it doesn't already have a scenarioId
          if (!course.scenarioId) {
            const processedCourse = await processCourseToScenario(course);
            processedCourses.push(processedCourse);
          } else {
            processedCourses.push(course);
          }
        } catch (error) {
          console.error(`Error processing course ${course.id}:`, error);
          // Add the original course if processing fails
          processedCourses.push(course);
        }
        
        // Update progress
        setProcessingProgress(Math.round(((i + 1) / totalCourses) * 100));
      }
      
      // Save processed courses to localStorage
      saveCourses(processedCourses);
      
      // Pass processed courses to parent component
      onSubmit(processedCourses);
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing courses:', error);
      // Submit original edited courses if processing fails
      onSubmit(editedCourses);
      onOpenChange(false);
    } finally {
      setProcessingScenarios(false);
      setProcessingProgress(0);
    }
  };

  const handleCourseChange = (index: number, field: 'title' | 'description', value: string) => {
    const newCourses = [...editedCourses];
    newCourses[index] = {
      ...newCourses[index],
      [field]: value
    };
    setEditedCourses(newCourses);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto border border-black/10 dark:border-white/20">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl font-bold">Customize Your Courses</DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
            We've generated these course suggestions based on your profession. Edit the titles and descriptions below to better match your specific learning needs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            {isLoading || processingScenarios ? (
              <div className="flex flex-col items-center justify-center p-8 my-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                <p className="mt-6 text-base text-gray-600 dark:text-gray-300 font-medium">
                  {isLoading ? 'Generating course suggestions...' : `Processing courses (${processingProgress}%)...`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {isLoading ? 'This may take a few moments' : 'Creating interactive scenarios for your courses'}
                </p>
              </div>
            ) : (
              editedCourses.map((course, index) => (
                <CourseCard 
                  key={course.id}
                  course={course} 
                  index={index} 
                  onChange={handleCourseChange} 
                />
              ))
            )}
          </div>
          <DialogFooter className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} size="lg" className="rounded-full">Cancel</Button>
            <Button type="submit" disabled={isLoading || processingScenarios} size="lg" className="rounded-full">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 