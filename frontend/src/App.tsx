import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirebaseAuthProvider } from "./contexts/FirebaseAuth.context";
import { ProtectedRoutes } from "./components/Authentication/ProtectedRoutes";

import SignUpPage from "./components/SignUp/page";
import SignInPage from "./components/SignIn/page";
import Profile from "./components/Profile/page";
import Lens from "./components/Lens/page";
import Dashboard from "./components/Dashboard/page";
import CreateMemo from "./components/CreateMemo/page";
import LandingPage from "./components/Landing/page";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <FirebaseAuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/lens" element={<Lens />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createMemo" element={<CreateMemo />} />
          </Route>
        </Routes>
      </FirebaseAuthProvider>
    </BrowserRouter>
  );
}
