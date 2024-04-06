import { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebase_auth from "../components/Authentication/firebase.config";

const AuthContext = createContext({} as any);

// a wrapper around the useContext hook to make it easier to use the AuthContext
export function useFirebaseAuth() {
  return useContext(AuthContext);
}

export function FirebaseAuthProvider(props: { children: any }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  function signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(firebase_auth, email, password);
  }

  function signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(firebase_auth, email, password);
  }

  function logOut() {
    return signOut(firebase_auth);
  }

  useEffect(() => {
    // https://firebase.google.com/docs/reference/js/auth.user
    const unsub = onAuthStateChanged(firebase_auth, (user) => {
      setCurrentUser(user);
      console.log(user);
    });
    return unsub;
  }, []);

  const value = {
    currentUser,
    firebaseSignUp: signUp,
    firebaseSignIn: signIn,
    firebaseSignOut: logOut,
  };
  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
