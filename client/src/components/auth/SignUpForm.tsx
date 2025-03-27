"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "../ui/CustomCard";

export default function SignUpForm() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    console.log("Submitting sign-up with:", { email, password });
    e.preventDefault();
    await dispatch(signUp(email, password));

    router.push("/dashboard"); // Redirect after sign-up
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
              minLength={6}
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
