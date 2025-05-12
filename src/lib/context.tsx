//@ts-nocheck
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {  onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { auth,provider } from "./Firebase.config.js";
import type { User } from 'firebase/auth';

interface FirebaseContextType {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    gooleSignIn: () => Promise<void>;
  }
  
  // Set default values for the context (null initially)
  const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);
  
  interface FirebaseProviderProps {
    children: ReactNode;
  }
  
  // FirebaseProvider component
  export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [fbl,setfbl] = useState(true);
    // Monitor authentication state
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setfbl(false);
      });
      return () => unsubscribe();
    }, []);
  
    // Function to handle sign in
    const signIn = async (email: string, password: string) => {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error("Error signing in:", error);
      }
    };
    // Function to haned gole sign in
    const gooleSignIn=async()=>
    {
        signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          // const credential = GoogleAuthProvider.credentialFromResult(result);
          // const token = credential?.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log(user)
         
        }).catch((error) => {
          
          console.log(error)
        });
      
    }
  
    // Function to handle sign out
    const logOut = async () => {
      try {
        await signOut(auth);
        setUser(null);
        window.location.reload();
      } catch (error) {
        console.error("Error signing out:", error);
      }
    };
  
    return (
      <FirebaseContext.Provider value={{ user, signIn, signOut: logOut,gooleSignIn,setfbl,fbl }} >
        {children}
      </FirebaseContext.Provider>
    );
  };
  
  // Custom hook to use FirebaseContext
export const useFirebase = () => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
      throw new Error("useFirebase must be used within a FirebaseProvider");
    }
    return context;
  };
  