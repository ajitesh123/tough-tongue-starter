"use client";

import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Clock, FileText, LayoutPanelTop, Globe } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ProfessionDialog from "@/components/ProfessionDialog";
import CourseDialog, { Course } from "@/components/CourseDialog";
import { fetchCourseSuggestions } from "@/app/utils/courses";

// Header component
const Header = () => {
  return (
    <div className="w-full max-w-4xl flex flex-col gap-3 mb-8">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI-first coaching Platform</h1>
      <p className="text-xl text-muted-foreground max-w-2xl">
        Create professional coaching scenarios tailored to your career with Tough Tongue AI
      </p>
    </div>
  );
};

// Course benefits grid component
const BenefitsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
      <FeatureCard 
        title="Personalized Scenarios" 
        description="AI-generated training content based on your profession and needs" 
        icon={MessageSquare} 
      />
      <FeatureCard 
        title="Interactive Practice" 
        description="Engage with AI tutors that provide real-time feedback on your responses" 
        icon={Sparkles} 
      />
      <FeatureCard 
        title="On-Demand Learning" 
        description="Access your custom training scenarios anytime, anywhere" 
        icon={Clock} 
      />
    </div>
  );
};

// Course modules component
const CourseModules = () => {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
      <div className="space-y-4">
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Step 1: Tell Us About Yourself</h3>
            <p className="text-gray-600 dark:text-gray-300">Enter your name and profession to help us create relevant training scenarios.</p>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Step 2: Customize Your Courses</h3>
            <p className="text-gray-600 dark:text-gray-300">Review and edit AI-generated course suggestions to match your specific needs.</p>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Step 3: Practice and Improve</h3>
            <p className="text-gray-600 dark:text-gray-300">Engage with interactive voice scenarios designed to build your professional skills.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// CTA buttons component
const CTAButtons = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
      <Button 
        variant="default" 
        onClick={onGetStarted}
        className="rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        Create Your Scenarios
      </Button>
      <Button 
        variant="outline" 
        asChild 
        className="rounded-full border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
      >
        <a href="/course">Learn More</a>
      </Button>
    </div>
  );
};

// Footer component
const Footer = () => {
  return (
    <footer className="row-start-3 flex gap-4 mt-12 flex-wrap items-center justify-center">
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a
          href="https://app.toughtongueai.com/docs/api-integration/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileText className="h-4 w-4" />
          Documentation
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a
          href="https://app.toughtongueai.com/developer/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LayoutPanelTop className="h-4 w-4" />
          Developer Portal
        </a>
      </Button>
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <a
          href="https://app.toughtongueai.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe className="h-4 w-4" />
          Visit Tough Tongue AI →
        </a>
      </Button>
    </footer>
  );
};

export default function Home() {
  const [professionDialogOpen, setProfessionDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [profession, setProfession] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);

  const handleGetStarted = () => {
    setProfessionDialogOpen(true);
  };

  const handleProfessionSubmit = async (profession: string) => {
    setProfession(profession);
    setProfessionDialogOpen(false);
    
    // Start loading courses
    setIsLoadingCourses(true);
    setCourseDialogOpen(true);
    
    try {
      const courseSuggestions = await fetchCourseSuggestions(profession);
      setCourses(courseSuggestions);
    } catch (error) {
      console.error('Error fetching course suggestions:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const handleCoursesSubmit = (editedCourses: Course[]) => {
    // Save the edited courses to state
    setSelectedCourses(editedCourses);
    console.log('Courses submitted with edits:', editedCourses);
    
    // Note: The redirect to the course page is now handled in the CourseDialog component
    // No need to navigate here as the dialog will handle it
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:py-12 gap-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 items-center sm:items-start w-full max-w-4xl">
        <Header />
        <CourseModules />
        <CTAButtons onGetStarted={handleGetStarted} />
      </main>
      <Footer />
      
      <ProfessionDialog
        open={professionDialogOpen}
        onOpenChange={setProfessionDialogOpen}
        onSubmit={handleProfessionSubmit}
      />
      
      <CourseDialog
        open={courseDialogOpen}
        onOpenChange={setCourseDialogOpen}
        courses={courses}
        isLoading={isLoadingCourses}
        onSubmit={handleCoursesSubmit}
      />
    </div>
  );
}
