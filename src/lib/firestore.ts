import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "@/lib/firebase"; // Import initialized Firebase app

// Initialize Firestore
export const db = getFirestore(firebaseApp);
