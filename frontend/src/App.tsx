import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccountPage from './createAccount/page'; 
import User from './user/page';
import Profile from './profile/page'; 
import Lens from './lens/page';
import Dashboard from './dashboard/page'; 
import CreateMemo from './CreateMemo/page'; 
import "./App.css";
import { useNavigate } from 'react-router-dom';
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
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

function Page() {
  const navigate = useNavigate();

  const handleNavigation = (destination: number) => {
    if (destination === 1) {
      navigate('/user');
    } else {
      navigate('/createAccount');
    }
  };

  return (
    <main className='Title'>
      <h1> Welcome!</h1>
      <button onClick={() => handleNavigation(1)} className='buttonLink'>Login</button>
      <button onClick={() => handleNavigation(2)} className='buttonLink'>Create Account</button>
    </main>
  );
}
