import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Sun, Moon } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem('isLoggedIn');
    if (userStatus === 'true') {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  // Grab the full state so we don't lose the product or query
  const returnState = location.state || {};
  const from = returnState.from || "/";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    // Pass the state BACK to the previous page
    navigate(from, { replace: true, state: returnState }); 
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 relative">
      
      {/* BACKGROUND GLOWS */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* NAVBAR - MATCHED TO HOME.TSX */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full relative z-50">
        <div className="flex items-center gap-6">
          {/* Glowing Back Arrow */}
          <button 
            onClick={() => navigate(from)} 
            className="relative group p-2 transition-all active:scale-90"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 absolute inset-0 m-auto text-amber-500/60 blur-[3px] animate-pulse transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative z-10 transform group-hover:-translate-x-1.5 transition-all duration-300 text-gray-600 dark:text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-500 cursor-pointer hidden sm:block">
            Honey<span className="text-gray-900 dark:text-white transition-colors duration-500">Hive</span>
          </div>
        </div>

        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* CENTERED LOGIN CARD */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md relative group">
          <div className="absolute inset-0 scale-[1.05] bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse pointer-events-none"></div>
          
          <div className="relative glass-card rounded-[2.5rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
                Join the <span className="text-amber-500">Hive.</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Log in to save your search history.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-amber-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm"
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within/input:text-amber-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm"
                />
              </div>

              <div className="relative group/btn pt-2">
                <div className="absolute inset-0 bg-amber-500/40 rounded-full blur-xl opacity-0 group-hover/btn:opacity-100 transition-opacity animate-pulse"></div>
                <button 
                  type="submit"
                  className="relative w-full bg-amber-500 text-gray-950 font-black py-4 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-lg z-10"
                >
                  Sign In <ArrowRight size={20} />
                </button>
              </div>
            </form>

            <div className="flex items-center my-8">
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              <span className="mx-4 text-gray-400 text-xs font-black uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            </div>

            <button 
              onClick={() => navigate('/signup')}
              className="w-full bg-transparent border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-full hover:border-amber-500 hover:text-amber-500 transition-all text-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}