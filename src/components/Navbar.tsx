"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";

const Navbar = () => {
  const { isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-primary/10 rounded">
              <DumbbellIcon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-bold font-mono">
              ultimate<span className="text-primary">fit</span>.ai
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-4">
            {isSignedIn ? (
              <>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors px-3 py-2"
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/generate-program"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors px-3 py-2"
                >
                  <DumbbellIcon size={16} />
                  <span>Generate</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors px-3 py-2"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
                
                <UserButton />
              </>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton>
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </div>
            )}
          </nav>

          {/* MOBILE MENU BUTTON */}
          <div className="flex items-center gap-2 md:hidden">
            {isSignedIn && <UserButton />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-9 w-9"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4">
            {isSignedIn ? (
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <HomeIcon size={20} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/generate-program"
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <DumbbellIcon size={20} />
                  <span>Generate Program</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon size={20} />
                  <span>Profile</span>
                </Link>

                <Button
                  asChild
                  className="mt-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Link href="/generate-program">Get Started</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <SignInButton>
                  <Button variant="outline" className="w-full justify-center">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button className="w-full justify-center">Sign Up</Button>
                </SignUpButton>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;