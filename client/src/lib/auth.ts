import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { AppDispatch } from "@/store";
import { setUser, logoutUser, setLoading } from "@/store/slices/authSlice";

export const signUp = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email || "" }));
  } catch (error) {
    console.error("Signup Error:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const signIn = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email || "" }));
  } catch (error) {
    console.error("Signin Error:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const logout = () => async (dispatch: AppDispatch) => {
  await signOut(auth);
  dispatch(logoutUser());
};
