"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  PlayCircle, 
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { MediaEmbed } from "@/components/MediaEmbed";
import { cn } from "@/lib/utils";
import { CourseSidebar } from "@/components/course/CourseSidebar";
import { getSavedCourses, Course as CourseType } from "@/app/utils/courses";

type MediaEmbedType = "loom" | "youtube" | "iframe" | "toughtongue" | "placeholder";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  mediaType: MediaEmbedType;
}

interface Course {
  title: string;
  lessons: Lesson[];
}

// Convert saved courses to lessons
const createLessonsFromCourses = (courses: CourseType[] | null): Course => {
  // Default course if no saved courses exist
  if (!courses || courses.length === 0) {
    return {
      title: "Product Management Interview Preparation",
      lessons: [
        {
          id: "favorite-product-question",
          title: "Introduction to Favorite Product Question",
          duration: "5:00",
          videoUrl: "https://www.youtube.com/watch?v=DLv10vzJucY",
          mediaType: "youtube"
        },
        {
          id: "answer-favorite-product-question",
          title: "Get your questions answered by AI",
          duration: "1:31",
          videoUrl: "https://app.toughtongueai.com/embed/677e5dbd261d3f3e3803b968?bg=black&skipPrecheck=true",
          mediaType: "toughtongue"
        },
        {
          id: "practice-favorite-product-question",
          title: "Practice Favorite Product Question",
          duration: "10:00",
          videoUrl: "https://app.toughtongueai.com/embed/677e7676de365dba3af0055a?bg=black&skipPrecheck=true",
          mediaType: "toughtongue"
        },
        {
          id: "practice-favorite-product-question-2",
          title: "Practice Favorite Product Question 2",
          duration: "10:00",
          videoUrl: "https://app.toughtongueai.com/embed/67b0248abc39997a6c6a4cc7?bg=black&skipPrecheck=true",
          mediaType: "toughtongue"
        }
      ]
    };
  }

  // Create lessons from courses with ToughTongue scenarios
  const lessons = courses.flatMap((course) => {
    const lessons: Lesson[] = [];
    
    // Add the ToughTongue practice scenario if available
    if (course.embedUrl) {
      lessons.push({
        id: `practice-${course.id}`,
        title: course.title,
        duration: "10:00",
        videoUrl: course.embedUrl,
        mediaType: "toughtongue"
      });
    }
    
    return lessons;
  });
  
  return {
    title: "Your Personalized Courses",
    lessons
  };
};

// Course content component
const CourseContent = ({ 
  lesson, 
  onPrevious, 
  onNext 
}: { 
  lesson: Lesson;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPrevious}
            className="md:hidden"
            aria-label="Previous lesson"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPrevious}
            className="hidden md:flex"
          >
            Previous
          </Button>
          
          <h1 className="text-xl md:text-2xl font-bold truncate">{lesson.title}</h1>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onNext}
            className="md:hidden"
            aria-label="Next lesson"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onNext}
            className="hidden md:flex"
          >
            Next
          </Button>
        </div>
        
        <MediaEmbed 
          type={lesson.mediaType}
          url={lesson.videoUrl}
          title={lesson.title}
          aspectRatio="16:9"
        />
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Answers to any interview question has three distinct parts: beginning, middle, and end. Each
            part requires different skills and techniques to deliver a solid answer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default function CourseClient() {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = getSavedCourses();
    const generatedCourse = createLessonsFromCourses(savedCourses);
    setCourseData(generatedCourse);
    
    // Set active lesson to first lesson if available
    if (generatedCourse.lessons.length > 0) {
      setActiveLesson(generatedCourse.lessons[0].id);
    }
  }, []);
  
  // Handle case where courseData is still loading
  if (!courseData || !activeLesson) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const currentLesson = courseData.lessons.find(l => l.id === activeLesson) || courseData.lessons[0];
  const currentIndex = courseData.lessons.findIndex(l => l.id === activeLesson);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setActiveLesson(courseData.lessons[currentIndex - 1].id);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < courseData.lessons.length - 1) {
      setActiveLesson(courseData.lessons[currentIndex + 1].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden relative">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 left-2 z-50 md:hidden"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label={showSidebar ? "Close menu" : "Open menu"}
      >
        {showSidebar ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>
      
      {/* Sidebar */}
      <div className={cn(
        "absolute md:relative inset-0 z-40 md:z-auto",
        showSidebar ? "block" : "hidden md:block"
      )}>
        <CourseSidebar 
          course={courseData}
          activeLesson={activeLesson}
          setActiveLesson={(id) => {
            setActiveLesson(id);
            setShowSidebar(false); // Close sidebar on mobile when lesson is selected
          }}
        />
      </div>
      
      {/* Content */}
      <CourseContent 
        lesson={currentLesson} 
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
} 