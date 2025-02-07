"use client";
import React, { useState, useEffect } from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Trophy } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
export const metadata = {
  title: "Silitech",
  description: "Exceptionally Durable",
}
// ---------------------------------------------------------------------
// Typewriter Effect Component
// ---------------------------------------------------------------------
function TypewriterEffect() {
  const [text, setText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Silitech";
  const typingSpeed = 150; // milliseconds per character

  useEffect(() => {
    if (text.length < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      // Hide cursor after typing is complete
      setTimeout(() => setShowCursor(false), 500);
    }
  }, [text]);

  return (
    <div className="relative inline-block">
      <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text animate-gradient">
        {text}
        <span
          className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
        >
          |
        </span>
      </h1>
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
          text-shadow: 0 0 10px rgba(255, 0, 255, 0.3),
            0 0 20px rgba(255, 0, 255, 0.3),
            0 0 30px rgba(255, 0, 255, 0.3);
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------
// Signup Form Demo Component with OTP Flow
// ---------------------------------------------------------------------
function SignupFormDemo() {
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");

  // OTP-related state
  const [otp, setOtp]                   = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpSent, setOtpSent]           = useState(false);
  const [otpVerified, setOtpVerified]   = useState(false);
  const [loading, setLoading]           = useState(false);
  const [errorMsg, setErrorMsg]         = useState("");

  // Function to generate a random 6-digit OTP
  const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP to the email via backend API
  const handleSendOtp = async () => {
    if (!email) {
      setErrorMsg("Please enter your email first.");
      return;
    }
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);
    setLoading(true);
    try {
      // Change the URL below to your backend server's URL.
      const res = await fetch("https://0.0.0.0:5001/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          template: "otp", // Your backend should recognize this template
          subject: "Your OTP Code for Silitech",
          templateData: { otp: otpCode, name: firstName || "User" }
        })
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setErrorMsg("");
      } else {
        setErrorMsg("Failed to send OTP. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg("Error sending OTP. Please try again.");
    }
    setLoading(false);
  };

  // Verify the OTP entered by the user
  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect OTP. Please try again.");
    }
  };

  // Final form submission; only allowed after OTP is verified.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!otpVerified) {
      setErrorMsg("Please verify the OTP before submitting.");
      return;
    }
    console.log("Form submitted with data:", { firstName, lastName, email });
    // Add additional submission logic (e.g. send data to your API) here.
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Silitech
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to Silitech if you can because we don&apos;t have a login flow yet.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              placeholder="Tyler"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              placeholder="Durden"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </LabelInputContainer>
        </div>
        {/* Email Field */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>

        {/* OTP Section */}
        <div className="mb-4">
          {!otpSent ? (
            <button
              type="button"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <div className="flex flex-col space-y-2">
              <LabelInputContainer>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  placeholder="Enter OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </LabelInputContainer>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </button>
              {otpVerified && <p className="text-green-500">OTP Verified!</p>}
            </div>
          )}
        </div>

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        {/* Submit Button */}
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

// ---------------------------------------------------------------------
// Landing Page Component
// ---------------------------------------------------------------------
export default function SilitechLandingPage() {
  const [isDark, setIsDark] = useState(true);

  const achievements = [
    { title: "Innovation Award 2024", description: "Best Tech Innovation" },
    { title: "Global Recognition", description: "Featured in Tech Monthly" },
    { title: "Market Growth", description: "500% YoY Growth" },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <WavyBackground
        colors={
          isDark
            ? ["#00ffff", "#ff00ff", "#00ff00"]
            : ["#4A90E2", "#9B51E0", "#43E2B7"]
        }
        speed="slow"
        waveOpacity={0.3}
        backgroundFill={isDark ? "black" : "white"}
        className="min-h-screen"
      >
        {/* Theme Toggle */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className={cn(
              "rounded-full p-3 transition-all duration-300 transform hover:scale-110",
              isDark
                ? "bg-white/20 hover:bg-white/30 text-white ring-2 ring-white/50"
                : "bg-gray-800/90 hover:bg-gray-800 text-white ring-2 ring-gray-800/50"
            )}
          >
            {isDark ? (
              <Sun className="h-5 w-5 animate-pulse" />
            ) : (
              <Moon className="h-5 w-5 animate-pulse" />
            )}
          </Button>
        </div>

        <div className="container mx-auto px-4 py-20 space-y-32">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <TypewriterEffect />
            <p className={`text-2xl font-light ${isDark ? "text-white/80" : "text-gray-800"}`}>
              Exceptionally Durable
            </p>
            <Button
              variant="outline"
              className={cn(
                "transition-all duration-300",
                isDark
                  ? "bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400/20"
                  : "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-600/20"
              )}
            >
              Learn More
            </Button>
          </div>

          {/* Achievements Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={cn(
                  "p-6 rounded-xl backdrop-blur-lg transition-all duration-300 transform hover:scale-105",
                  isDark
                    ? "bg-white/10 hover:bg-white/15 border border-white/10"
                    : "bg-gray-800/5 hover:bg-gray-800/10 border border-gray-800/10"
                )}
              >
                <Trophy
                  className={cn("w-8 h-8 mb-4", isDark ? "text-cyan-400" : "text-blue-600")}
                />
                <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-800")}>
                  {achievement.title}
                </h3>
                <p className={isDark ? "text-white/80" : "text-gray-700"}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>

          {/* Signup Form Section */}
          <div className="relative">
            <div className="relative z-10">
              <SignupFormDemo />
            </div>
          </div>

          {/* Founder Section */}
          <div
            className={cn(
              "rounded-2xl p-8 backdrop-blur-lg transition-all duration-300 shadow-lg",
              isDark ? "bg-gray-900/80 border border-gray-700" : "bg-white/90 border border-gray-300"
            )}
          >
            <h2
              className={cn(
                "text-3xl font-bold mb-8 text-center bg-clip-text text-transparent",
                isDark
                  ? "bg-gradient-to-r from-cyan-400 to-purple-500"
                  : "bg-gradient-to-r from-blue-600 to-purple-600"
              )}
            >
              Our Founder
            </h2>
            <div className="text-center">
              <h3 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-gray-800")}>
                Tathagata Ghosh
              </h3>
              <p className={cn("mt-2", isDark ? "text-white/80" : "text-gray-700")}>
                Founder & CEO
              </p>
              <p className={cn("mt-4 max-w-2xl mx-auto leading-relaxed", isDark ? "text-white/60" : "text-gray-600")}>
                Visionary tech leader pioneering the future of durable technology solutions.
                With a passion for innovation and commitment to excellence, Tathagata Ghosh steers
                the company towards groundbreaking achievements.
              </p>
            </div>
          </div>

          {/* Instagram Link */}
          <div className="text-center">
            <a
              href="https://instagram.com/silitecharena"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "transition-colors font-medium",
                isDark ? "text-pink-400 hover:text-pink-300" : "text-purple-700 hover:text-purple-600"
              )}
            >
              Follow us on Instagram
            </a>
          </div>
        </div>
      </WavyBackground>
    </div>
  );
}
