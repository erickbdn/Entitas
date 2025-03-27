"use client"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/store";
import { setUser, logoutUser } from "@/store/slices/authSlice";
import { auth } from "@/lib/firebase";
import { NavigationProvider } from "./context/NavigationContext";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Background from "./components/Background";
// import TestFirestore from "./components/TestFirestore";

interface ProtectedERPLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedERPLayout({ children }: ProtectedERPLayoutProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loading = useSelector((state: RootState) => state.auth.loading);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({ uid: user.uid, email: user.email ?? "" }));
      } else {
        dispatch(logoutUser());
        router.push("/");
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [dispatch, router]);

  if (checkingAuth || loading) {
    return <div>Loading...</div>;
  }

  return (
    <NavigationProvider>
      {/* Full Screen Layout with 32px Side Margins */}
      <div className="min-h-screen flex flex-col px-8">  
        <Background />
        <Header />
        
        {/* Sidebar & Content Wrapper with 24px gutter */}
        <div className="flex flex-1 gap-6">  
          <Sidebar />
          {/* <TestFirestore /> */} {/* Uncomment this line to test Firestore */} 
          <main className="flex-1 overflow-auto h-[calc(100vh-80px)] pt-4 pb-4 pr-4">{children}</main>
        </div>
      </div>
    </NavigationProvider>
  );
}
