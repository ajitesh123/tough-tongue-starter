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

export interface Course {
  id: string;
  title: string;
  description: string;
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
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Generating course suggestions...</p>
  </div>
);

// Course card component for editing individual courses
interface CourseCardProps {
  course: Course;
  index: number;
  onChange: (index: number, field: 'title' | 'description', value: string) => void;
}

const CourseCard = ({ course, index, onChange }: CourseCardProps) => (
  <Card key={course.id} className="shadow-sm border-[0.5px] border-black/30 overflow-hidden">
    <div className="p-1">
      <div className="mb-0.5">
        <Label htmlFor={`course-title-${index}`} className="text-xs text-gray-500 mb-0">Course Title</Label>
        <Input
          id={`course-title-${index}`}
          value={course.title}
          onChange={(e) => onChange(index, 'title', e.target.value)}
          className="font-medium text-xs h-6 border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
        />
      </div>
      <div>
        <Label htmlFor={`course-desc-${index}`} className="text-xs text-gray-500 mb-0">Description</Label>
        <div className="text-xs max-w-full min-h-[40px] break-words overflow-hidden">
          {course.description.split(' ').map((word, i) => (
            <span key={i} className="break-all inline-block max-w-full pr-1">{word}</span>
          ))}
          <Input
            id={`course-desc-${index}`}
            value={course.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className="text-xs w-full max-w-full border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 opacity-0 h-0 absolute"
          />
        </div>
      </div>
    </div>
  </Card>
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

  // Update local state when courses prop changes
  useEffect(() => {
    setEditedCourses(courses);
  }, [courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editedCourses);
    onOpenChange(false);
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto border border-black/30">
        <DialogHeader className="pb-1">
          <DialogTitle className="mt-2">Customize Your Courses</DialogTitle>
          <DialogDescription className="text-sm">
            We've generated these course suggestions based on your profession. Feel free to edit them to better match your needs.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-1.5 py-1">
            {isLoading ? (
              <LoadingIndicator />
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
          <DialogFooter className="pt-1">
            <Button type="submit" disabled={isLoading} size="sm">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 