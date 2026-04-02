import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut, Sun, Moon } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Theme State
  const [isDark, setIsDark] = useState(false);

  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail || !showProfileMenu) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/auth/history?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        if (data.history) {
          setRecentSearches(data.history.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch recent searches", error);
      }
    };
    fetchRecent();
  }, [showProfileMenu]);

  useEffect(() => {
    const userStatus = localStorage.getItem('isLoggedIn');
    if (userStatus === 'true') setIsLoggedIn(true);
    
    // Sync React state with the HTML tag on load
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/results', { state: { query: searchQuery } });
    }
  };

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="animate-page min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-50">
        <div className="text-2xl font-black tracking-tighter text-amber-500 cursor-pointer">
          Honey<span className="text-gray-900 dark:text-white transition-colors duration-500">Hive</span>
        </div>
        
        <div className="font-medium flex items-center gap-4">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 mr-2"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300 font-bold tracking-wide hidden sm:block">
                Hi, {localStorage.getItem('userName') || localStorage.getItem('userEmail')?.split('@')[0] || 'User'}!
              </span>

              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-3 rounded-full bg-amber-500 text-gray-950 hover:bg-amber-400 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] relative z-50"
                >
                  <User size={24} />
                </button>

                {showProfileMenu && (
                  <>
                    {/* Dropdown exit */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-4 w-72 glass-card rounded-3xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                      <div className="p-4 border-b border-gray-200 dark:border-white/10">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="font-bold text-gray-900 dark:text-white truncate text-sm">
                          {localStorage.getItem('userEmail') || 'Loading...'}
                        </p>
                      </div>
                      
                      <div className="p-2">
                        <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent</div>
                        {recentSearches.length > 0 ? (
                          recentSearches.map((item, index) => (
                            <button 
                              key={index} 
                              onClick={() => {
                                setShowProfileMenu(false);
                                navigate('/results', { state: { query: item.product_url || item.query } });
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3"
                            >
                              <Clock size={14} className="opacity-50 flex-shrink-0" />
                              <span className="truncate">{item.product_url || item.query}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-4 text-center text-xs text-gray-500 font-medium">
                            No recent searches yet.
                          </div>
                        )}
                        
                        {/* View All History Button */}
                        <button 
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/history');
                          }} 
                          className="w-full text-center px-3 py-2 mt-2 text-sm text-amber-500 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors"
                        >
                          View All History
                        </button>
                      </div>

                      <div className="p-2 border-t border-gray-200 dark:border-white/10">
                        <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors flex items-center gap-3 font-bold">
                          <LogOut size={16} /> Log Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-amber-500 text-gray-950 px-8 py-2.5 rounded-full hover:bg-amber-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 border border-amber-400/50">
              Log In
            </button>
          )}
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center mt-32 px-4 text-center relative z-10">
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6 text-gray-900 dark:text-white transition-colors duration-500">
          Find the <span className="text-amber-500">sweetest</span> deals.
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl mb-12 max-w-2xl font-medium leading-relaxed transition-colors duration-500 mx-auto">
          Shop with absolute clarity. Instantly compare live prices, verify availability, and unlock AI-powered product reviews.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
          
          <div className="absolute inset-0 scale-[1.02] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
            
          </div>
          
          <div className="relative glass-card rounded-[2.5rem] p-2 flex items-center border border-gray-200 dark:border-white/10 group-hover:border-amber-500/30 group-focus-within:border-amber-500/50 transition-colors z-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Paste link or search product..."
              className="w-full bg-transparent text-gray-900 dark:text-white text-lg py-4 pl-8 pr-4 focus:outline-none focus:ring-0 placeholder:text-gray-400 font-medium"
            />
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-10 py-4 rounded-[2rem] transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}