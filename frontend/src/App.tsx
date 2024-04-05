import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import CreateAccountPage from './components/CreateAccount/page'; 
import User from './components/User/page';
import Profile from './components/Profile/page';
import Lens from './components/Lens/page';
import Dashboard from './components/Dashboard/page'; 
import CreateMemo from './components/CreateMemo/page'; 
import "./App.css";
import { FirebaseAuthProvider } from './contexts/FirebaseAuth.context';

export default function App() {
  return (
    <FirebaseAuthProvider>
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
    </FirebaseAuthProvider>
  );
}

// NOTE -- is there a better way to do this?
//         this and the above way that routes are handled is a bit scuffed
//         someone reason <Page/> is the referenced component instead of App as the entry point
function LandingPage() {
  const navigate = useNavigate();

  // NOTE -- this function is redundant
  const handleNavigation = (destination: number) => {
    if (destination === 1) {
      navigate('/user');
    } else {
      navigate('/createAccount');
    }
  };

  return (
    <main className='Title'>
      <div className="text-center mt-20 m-auto w-1/3 pt-10 pb-10 bg-blue-200 border-2 border-blue-800 rounded-3xl">
        <h1 className="font-bold mb-1 text-blue-800">Moments</h1>
        <p className="text-blue-800 font-sm italic mb-4">A Spatial Journalling App</p>
        <button onClick={() => handleNavigation(1)} className='bg-blue-100 text-blue-800 border-2 border-blue-800 mr-2'>Login</button>
        <button onClick={() => handleNavigation(2)} className='bg-blue-100 text-blue-800 border-2 border-blue-800'>Create Account</button>
      </div>
    </main>
  );
}
