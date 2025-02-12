"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth"; // Import our sign-in function
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "../ui/custom-card";
import { useAppDispatch } from "@/store"; // Import our typed dispatch

export default function SignInForm() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await dispatch(signIn(email, password)); // ✅ Fixes TS warning
      console.log("✅ Signed in successfully!");
      router.push("/"); // Redirect to dashboard after sign-in
      // Redirect to dashboard or another page if needed
    } catch (err) {
      console.log(err)
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomCard variant="transparent">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-secondary-light">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-secondary-light">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-secondary-light">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Link href="#" className="block text-sm text-secondary-light hover:text-white transition-colors">
            Forgot password?
          </Link>
          <Button type="submit" className="w-full bg-accent text-white hover:bg-white/20 transition-colors" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </CustomCard>
  );
}
