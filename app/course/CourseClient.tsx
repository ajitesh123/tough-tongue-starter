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
import { getSavedCourses } from "@/app/store/localStorageUtils";
import { Course as CourseType } from "@/app/utils/courses";

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

// Processing notification component
const BackgroundProcessingNotification = ({ 
  isProcessing, 
  progress, 
  totalCourses, 
  completedCourses,
  onDismiss
}: { 
  isProcessing: boolean; 
  progress: number;
  totalCourses: number;
  completedCourses: number;
  onDismiss: () => void;
}) => {
  if (!isProcessing) return null;
  
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <div className="bg-black/80 dark:bg-white/20 backdrop-blur-sm text-white rounded-lg p-4 shadow-lg pointer-events-auto max-w-md">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="font-medium">Processing your courses</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{completedCourses} of {totalCourses}</span>
              <button 
                onClick={onDismiss}
                className="text-white/70 hover:text-white focus:outline-none"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div 
              className="bg-primary h-1.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <p className="text-xs text-gray-300">
            {progress < 100 
              ? "Your additional courses are being created in the background" 
              : "Processing complete! All your courses are ready."}
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
  const [isLoadingMoreCourses, setIsLoadingMoreCourses] = useState(false);
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [totalCoursesToProcess, setTotalCoursesToProcess] = useState(0);
  const [completedCourses, setCompletedCourses] = useState(0);
  
  // Load processing status from sessionStorage on mount
  useEffect(() => {
    const processingStatus = sessionStorage.getItem('courseProcessingStatus');
    if (processingStatus) {
      try {
        const { inProgress, progress, total, completed } = JSON.parse(processingStatus);
        setBackgroundProcessing(inProgress);
        setProcessingProgress(progress);
        setTotalCoursesToProcess(total);
        setCompletedCourses(completed);
      } catch (error) {
        console.error('Error parsing processing status:', error);
        sessionStorage.removeItem('courseProcessingStatus');
      }
    }
  }, []);
  
  // Load courses from localStorage on component mount and poll for updates
  useEffect(() => {
    // Initial load
    loadCoursesFromStorage();
    
    // Set up polling for new course data and processing status
    const intervalId = setInterval(() => {
      // Check for new courses
      const currentCourses = getSavedCourses();
      const currentCoursesCount = courseData?.lessons.length || 0;
      
      // Check for processing status updates
      const processingStatus = sessionStorage.getItem('courseProcessingStatus');
      if (processingStatus) {
        try {
          const { inProgress, progress, total, completed } = JSON.parse(processingStatus);
          
          // Only update if values have changed
          if (inProgress !== backgroundProcessing) {
            setBackgroundProcessing(inProgress);
          }
          
          if (progress !== processingProgress) {
            setProcessingProgress(progress);
          }
          
          if (total !== totalCoursesToProcess) {
            setTotalCoursesToProcess(total);
          }
          
          if (completed !== completedCourses) {
            setCompletedCourses(completed);
          }
        } catch (error) {
          console.error('Error parsing processing status:', error);
        }
      }
      
      if (currentCourses) {
        // If we have more courses now than before, update the course data
        if (currentCourses.length > currentCoursesCount) {
          setIsLoadingMoreCourses(true);
          loadCoursesFromStorage();
        }
      }
    }, 1000); // Check every second for more responsive updates
    
    return () => clearInterval(intervalId);
  }, [
    courseData?.lessons.length, 
    totalCoursesToProcess, 
    backgroundProcessing,
    processingProgress,
    completedCourses
  ]);
  
  // Function to handle completion of processing
  const handleProcessingComplete = () => {
    // Set a timeout to remove the notification
    setTimeout(() => {
      setBackgroundProcessing(false);
      sessionStorage.removeItem('courseProcessingStatus');
    }, 3000); // Keep the complete message visible for 3 seconds
  };
  
  // Check if processing is complete when the progress changes
  useEffect(() => {
    if (processingProgress >= 100 && backgroundProcessing) {
      handleProcessingComplete();
    }
  }, [processingProgress, backgroundProcessing]);
  
  // Load courses from localStorage
  const loadCoursesFromStorage = () => {
    const savedCourses = getSavedCourses();
    const generatedCourse = createLessonsFromCourses(savedCourses);
    setCourseData(generatedCourse);
    
    // Set active lesson to first lesson if available and we don't have one selected
    if (generatedCourse.lessons.length > 0 && !activeLesson) {
      setActiveLesson(generatedCourse.lessons[0].id);
    }
    
    // Check if all courses are processed
    const processingStatus = sessionStorage.getItem('courseProcessingStatus');
    if (processingStatus) {
      try {
        const { total, completed } = JSON.parse(processingStatus);
        if (completed >= total) {
          // All courses are processed, update status to complete
          const updatedStatus = {
            inProgress: false,
            progress: 100,
            total,
            completed
          };
          sessionStorage.setItem('courseProcessingStatus', JSON.stringify(updatedStatus));
          handleProcessingComplete();
        }
      } catch (error) {
        console.error('Error checking processing status:', error);
      }
    }
    
    setIsLoadingMoreCourses(false);
  };
  
  // Handle case where courseData is still loading
  if (!courseData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Make sure we always have an active lesson if there are lessons available
  if (courseData.lessons.length > 0 && !activeLesson) {
    setActiveLesson(courseData.lessons[0].id);
  }
  
  const currentLesson = activeLesson 
    ? courseData.lessons.find(l => l.id === activeLesson) 
    : courseData.lessons[0] || null;
  
  const currentIndex = activeLesson 
    ? courseData.lessons.findIndex(l => l.id === activeLesson)
    : 0;
  
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
          activeLesson={activeLesson || ''}
          setActiveLesson={(id) => {
            setActiveLesson(id);
            setShowSidebar(false); // Close sidebar on mobile when lesson is selected
          }}
        />
        
        {isLoadingMoreCourses && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-primary/10 text-primary text-sm rounded-full px-4 py-2 flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading more courses...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Content */}
      {currentLesson ? (
        <CourseContent 
          lesson={currentLesson} 
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      ) : (
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Select a course to begin</h2>
            <p className="text-muted-foreground">Choose a course from the sidebar to get started</p>
          </div>
        </div>
      )}
      
      {/* Background processing notification */}
      <BackgroundProcessingNotification 
        isProcessing={backgroundProcessing}
        progress={processingProgress}
        totalCourses={totalCoursesToProcess}
        completedCourses={completedCourses}
        onDismiss={() => {
          setBackgroundProcessing(false);
          // Keep the status in sessionStorage in case we need it later,
          // but hide the notification for the user
        }}
      />
    </div>
  );
} 