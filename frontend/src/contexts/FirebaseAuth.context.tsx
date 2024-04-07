import { createContext, useContext, useEffect, useState } from "react";
import firebase_auth from "../components/Authentication/firebase.config";
import {
  User as FirebaseUser,
  UserCredential,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
} from "firebase/auth";

const AuthContext = createContext(
  {} as {
    currentUser: FirebaseUser | null;
    isLoading: boolean;
    firebaseSignUp: (email: string, password: string) => Promise<UserCredential>;
    firebaseSignIn: (email: string, password: string) => Promise<UserCredential>;
    firebaseSignOut: () => Promise<void>;
    firebaseDeleteUser: () => Promise<void>;
  }
);
export function useFirebaseAuth() {
  return useContext(AuthContext);
}

export function FirebaseAuthProvider(props: { children: any }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  function signUp(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(firebase_auth, email, password);
  }

  function signIn(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(firebase_auth, email, password);
  }

  function logOut(): Promise<void> {
    return signOut(firebase_auth);
  }

  function deleteUserAccount(): Promise<void> {
    return deleteUser(user);
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(firebase_auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = {
    currentUser: user,
    isLoading: loading,
    firebaseSignUp: signUp,
    firebaseSignIn: signIn,
    firebaseSignOut: logOut,
    firebaseDeleteUser: deleteUserAccount,
  };
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
}
