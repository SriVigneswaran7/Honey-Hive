import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './Home';
import Login from './Login';
import './index.css';
import Results from './Results';
import Details from './Details';
import Signup from './Signup';
import History from './History';
import Help from './Help';
/**
 * The root application component.
 * * Responsible for setting up the global layout, initializing the application's 
 * dark/light theme preferences, and providing the routing context for all pages.
 * * @component
 * @returns {JSX.Element} The rendered React component containing the router and global UI layers.
 */
function App() {
  // Checks local storage on initial load so the theme stays consistent
  useEffect(() => {
    //[AI Assist: Ref 20] - See GenAIReflection.md for prompt and architectural review.
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden transition-colors duration-700 bg-white dark:bg-slate-950">
      
      {/* Glow Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] bg-amber-400/40 dark:bg-amber-600/20 rounded-full blur-[120px] animate-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-rose-400/40 dark:bg-indigo-600/20 rounded-full blur-[120px] animate-glow [animation-delay:2s] pointer-events-none z-0" />

      {/* UI layer*/}
      <div className="relative z-10">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/results" element={<Results />} />
            <Route path="/review" element={<Details />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/history" element={<History />} />
            <Route path="/guide" element={<Help />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;