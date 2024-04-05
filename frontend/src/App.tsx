import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreateAccountPage from "./components/CreateAccount/page";
import User from "./components/User/page";
import Profile from "./components/Profile/page";
import Lens from "./components/Lens/page";
import Dashboard from "./components/Dashboard/page";
import CreateMemo from "./components/CreateMemo/page";
import LandingPage from "./components/Landing/page";
import "./App.css";

export default function App() {
  return (
    // is there a better way to do this?
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<User />} />
        <Route path="/createAccount" element={<CreateAccountPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/lens" element={<Lens />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createMemo" element={<CreateMemo />} />
      </Routes>
    </Router>
  );
}
