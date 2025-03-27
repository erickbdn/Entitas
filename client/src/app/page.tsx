"use client";

import { useEffect, useState } from "react";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true); // Prevents flickering
  const [isSignUp, setIsSignUp] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        router.replace("/dashboard"); // Redirect if already signed in
      } else {
        setCheckingAuth(false); // Allow the sign-in page to render
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (checkingAuth) return null; // Avoid showing the sign-in form while checking

  return (
    <div
      className="relative flex flex-col lg:flex-row min-h-screen bg-cover bg-center bg-no-repeat lg:bg-desktop"
      style={{
        backgroundImage: "url('/AuthBG.jpg')",
        backgroundSize: "cover",
      }}
    >
      {/* ENTITAS Title */}
      <h1 className="absolute top-0 left-0 p-6 text-5xl sm:text-6xl md:text-7xl lg:text-9xl text-secondary-light font-bold z-10 tracking-tight">
        ENTITAS
      </h1>

      {/* Left Section (Always Visible) */}
      <div className="lg:w-1/2 relative p-12 flex flex-col items-center lg:items-start text-center lg:text-left mb-0 lg:mb-40">
        <div className="absolute top-1/2 -translate-y-1/2 lg:ml-12 max-w-md mt-40 pb-6 lg:mt-0 lg:pb-0">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto lg:mx-0"
          >
            <circle cx="12" cy="12" r="11" fill="#E9E1D8" />
            <path
              d="M12 6V18"
              stroke="#BCA58A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17.196 9L6.80402 15"
              stroke="#BCA58A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.80402 9L17.196 15"
              stroke="#BCA58A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="mt-4 text-xl leading-6 text-secondary-lighter font-medium">
            Welcome to Entitas—where simplicity meets functionality. Manage,
            analyze, and grow your business with a platform designed for
            seamless performance and sleek design.
          </p>
        </div>
      </div>

      {/* Right Section - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative mt-56 lg:mt-0">
        {/* Blur Overlay */}
        <div
          className="absolute inset-0 w-full h-full backdrop-blur-lg pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to left, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to left, rgba(0, 0, 0, 1) 90%, rgba(0, 0, 0, 0) 100%)",
          }}
        ></div>

        {/* Auth Form */}
        <div className="w-full max-w-md p-8 rounded-2xl relative z-10">
          {isSignUp ? <SignUpForm /> : <SignInForm />}
          <Button
            variant="link"
            className="mt-4 w-full text-secondary-light"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
