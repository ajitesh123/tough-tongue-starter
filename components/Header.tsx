"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Drona AI
            </Link>
          </div>
          <nav className="flex items-center justify-center space-x-6">
            <Link 
              href="/" 
              className={`hover:text-gray-600 ${pathname === "/" ? "font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/course" 
              className={`hover:text-gray-600 ${pathname === "/course" ? "font-semibold" : ""}`}
            >
              Course
            </Link>
          </nav>
          <div className="flex justify-end">
            <SignedOut>
              <Link href="/sign-in" className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </header>
  );
} 