import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, MessageSquare, Clock, FileText, LayoutPanelTop, Globe } from "lucide-react";
import { FeatureCard } from "../components/FeatureCard";

// Header component
const Header = () => {
  return (
    <>
      <h1 className="text-4xl font-bold">AI-First Professional Coaching</h1>
      <p className="text-xl text-center sm:text-left max-w-2xl">
        Master new skills with interactive voice-based learning powered by Tough Tongue AI
      </p>
    </>
  );
};

// Course benefits grid component
const BenefitsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
      <FeatureCard 
        title="Interactive Learning" 
        description="Practice conversations with AI tutors that adapt to your learning pace" 
        icon={MessageSquare} 
      />
      <FeatureCard 
        title="Real-time Feedback" 
        description="Receive instant feedback on your responses and communication style" 
        icon={Sparkles} 
      />
      <FeatureCard 
        title="Flexible Schedule" 
        description="Learn anytime, anywhere with 24/7 access to practice sessions" 
        icon={Clock} 
      />
    </div>
  );
};

// Course modules component
const CourseModules = () => {
  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-2xl font-semibold mb-4">Course Modules</h2>
      <div className="space-y-4">
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Module 1: [Module Name]</h3>
            <p className="text-gray-600 dark:text-gray-300">Brief description of this module and what students will learn.</p>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Module 2: [Module Name]</h3>
            <p className="text-gray-600 dark:text-gray-300">Brief description of this module and what students will learn.</p>
          </CardContent>
        </Card>
        <Card className="p-0">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium">Module 3: [Module Name]</h3>
            <p className="text-gray-600 dark:text-gray-300">Brief description of this module and what students will learn.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// CTA buttons component
const CTAButtons = () => {
  return (
    <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
      <Button 
        variant="default" 
        asChild 
        className="rounded-full bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
      >
        <a href="/course">Enroll Now</a>
      </Button>
      <Button 
        variant="outline" 
        asChild 
        className="rounded-full border-black/[.08] dark:border-white/[.145] hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
      >
        <a href="/course">Get Started</a>
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
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-12 gap-4 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start">
        <Header />
        <BenefitsGrid />
        <CourseModules />
        <CTAButtons />
      </main>
      <Footer />
    </div>
  );
}
