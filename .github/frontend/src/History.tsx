import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Clock, ChevronRight } from 'lucide-react';

export default function History() {
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);

  // THE REVERSE GHOST GUARD: Kicks users out if they aren't logged in
  useEffect(() => {
    const userStatus = localStorage.getItem('isLoggedIn');
    if (userStatus !== 'true') {
      navigate('/', { replace: true });
    }
    setIsDark(document.documentElement.classList.contains('dark'));
  }, [navigate]);

  // Temporary: This mock data will be replaced by a live database fetch later.
  const [pastSearches] = useState([
    { id: 1, query: 'Sony WH-1000XM5 Wireless Headphones', date: '2026-03-08', dealsFound: 4 },
    { id: 2, query: 'Keychron K2 Mechanical Keyboard', date: '2026-03-07', dealsFound: 2 },
    { id: 3, query: 'LG C3 OLED TV 55"', date: '2026-03-05', dealsFound: 7 },
  ]);

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
    <div className="animate-page min-h-screen flex flex-col text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      
      {/* Glow Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full relative z-50">
        <div className="flex items-center gap-6">

          {/* Back button */}
          <button onClick={() => navigate(-1)} className="relative group p-2 transition-all active:scale-90">
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

        <button onClick={toggleTheme} className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 relative z-10 mt-4">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
            Your <span className="text-amber-500">History.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Review your past searches and tracked deals.</p>
        </div>

        <div className="glass-card rounded-[2.5rem] p-4 sm:p-8 border border-gray-200 dark:border-white/10 shadow-2xl relative group">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-rose-500/5 rounded-[2.5rem] opacity-50 pointer-events-none"></div>

          {pastSearches.length > 0 ? (
            <ul className="flex flex-col gap-4 relative z-10">
              {pastSearches.map((item) => (
                <li 
                  key={item.id} 

                  onClick={() => navigate('/results', { state: { query: item.query } })}
                  className="bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-400 group-hover/item:text-amber-500 group-hover/item:bg-amber-500/10 transition-colors hidden sm:block">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover/item:text-amber-500 transition-colors line-clamp-1">{item.query}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Searched on {item.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full">
                    <span className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 py-1.5 px-4 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
                      {item.dealsFound} Deals
                    </span>
                    <ChevronRight size={20} className="text-gray-400 group-hover/item:text-amber-500 transform group-hover/item:translate-x-1 transition-all" />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-12 text-center relative z-10">
              <Clock size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No history yet</h3>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Your past searches will appear here. Start hunting for deals!</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-8 bg-amber-500 text-gray-950 px-8 py-3 rounded-full font-black hover:bg-amber-400 transition-all shadow-lg active:scale-95"
              >
                Start Searching
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}