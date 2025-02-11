"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "../ui/custom-card";
import { signUp } from "@/lib/auth"; // Import auth function

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signUp(email, password);
      router.push("/dashboard"); // Redirect to dashboard after sign-up
    } catch (err) {
      console.log(err)
      setError("Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomCard variant="transparent">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-secondary-light">
          Sign Up
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-secondary-light">
              Full Name
            </Label>
            <Input
              id="full-name"
              placeholder="Enter your full name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-secondary-light">
              Email
            </Label>
            <Input
              id="email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-secondary-light">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
          {error && <p className="text-error text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-accent text-white hover:bg-white/20 transition-colors" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
        <Link href="/sign-in" className="block text-sm text-secondary-light hover:text-white transition-colors">
          Already have an account? Sign In
        </Link>
      </CardContent>
    </CustomCard>
  );
}
