import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Import Firebase instance

// Sign In Function
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

// Sign Up Function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
  }
};

// Sign Out Function
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
  }
};
