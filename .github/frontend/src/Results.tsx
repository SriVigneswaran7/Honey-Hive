import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Clock, LogOut, Sun, Moon } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const initialQuery = location.state?.query || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const recentSearches = [
    { id: 1, query: 'Sony WH-1000XM5' },
    { id: 2, query: 'Keychron K2 Keyboard' },
    { id: 3, query: 'LG C3 OLED TV 55"' },
  ];

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
    setIsDark(document.documentElement.classList.contains('dark'));

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); 
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

  const fetchProducts = async (query: string) => {
    if (!query) return;
    const cachedData = sessionStorage.getItem(`honeyhive_results_${query}`);
    if (cachedData) {
      setProducts(JSON.parse(cachedData));
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const resultsArray = data.shopping_results || [];
      setProducts(resultsArray);
      sessionStorage.setItem(`honeyhive_results_${query}`, JSON.stringify(resultsArray));
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) fetchProducts(initialQuery);
  }, [initialQuery]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 pb-20 relative z-10">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-50">
        
        {/* Back Arrow + Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="relative group p-2 transition-all active:scale-90"
            aria-label="Go Back"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-7 w-7 absolute inset-0 m-auto text-amber-500/60 blur-[3px] animate-pulse transform group-hover:-translate-x-1.5 transition-transform duration-300" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={4} 
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>

            {/* Main Arrow */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7 relative z-10 transform group-hover:-translate-x-1.5 transition-all duration-300 
                         text-gray-600 dark:text-gray-400 
                         group-hover:text-amber-500 dark:group-hover:text-amber-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-500 cursor-pointer hidden sm:block">
            Honey<span className="text-gray-900 dark:text-white transition-colors duration-500">Hive</span>
          </div>
        </div>

        {/* Mini Search Bar */}
        <div className="flex-1 max-w-xl mx-8 relative group">
          <div className="absolute inset-0 scale-[1.02] opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full blur-md opacity-20 animate-pulse"></div>
          </div>
          <div className="relative glass-card rounded-full p-1.5 flex items-center border border-gray-200 dark:border-white/10 group-hover:border-amber-500/30 transition-all shadow-inner">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent py-2 px-6 focus:outline-none font-medium text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={() => {
                sessionStorage.removeItem(`honeyhive_results_${searchInput}`);
                fetchProducts(searchInput);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-2 rounded-full text-xs transition-all shadow-md active:scale-95"
            >
              Update
            </button>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="font-medium flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-3 rounded-full bg-amber-500 text-gray-950 hover:bg-amber-400 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] relative z-50"
              >
                <User size={24} />
              </button>

              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
                  <div className="absolute right-0 mt-4 w-72 glass-card rounded-3xl shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-gray-200 dark:border-white/10">
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Signed in as</p>
                      <p className="font-bold text-gray-900 dark:text-white truncate text-sm">user@honeyhive.com</p>
                    </div>
                    <div className="p-2">
                      <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent</div>
                      {recentSearches.map((item) => (
                        <button key={item.id} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">
                          <Clock size={14} className="opacity-50" />
                          <span className="truncate">{item.query}</span>
                        </button>
                      ))}
                      <button onClick={() => { setShowProfileMenu(false); navigate('/history'); }} className="w-full text-center px-3 py-2 mt-2 text-sm text-amber-500 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-colors">
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
          ) : (
            <button 
              onClick={() => navigate('/login', { state: { from: location.pathname, query: searchInput } })} 
              className="bg-amber-500 text-gray-950 px-8 py-2.5 rounded-full hover:bg-amber-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 border border-amber-400/50"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center mt-32">
            <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-6"></div>
            <p className="font-bold animate-pulse text-gray-500 tracking-wide text-lg">Scraping the sweetest deals...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="relative glass-card rounded-[2.5rem] p-5 flex flex-col border border-gray-200 dark:border-white/10 hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] group">
                <div className="h-60 bg-white rounded-3xl p-6 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                   <span className="absolute top-4 left-4 bg-gray-950/90 text-amber-500 text-[10px] font-black px-3 py-1 rounded-full uppercase z-10 shadow-md">
                    {product.store}
                  </span>
                  <img src={product.thumbnail} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight px-1">{product.title}</h3>
                <div className="text-4xl font-black text-amber-500 mb-8 px-1 tracking-tighter">{product.price}</div>
                <div className="mt-auto space-y-3">
                  <button onClick={() => navigate('/review', { state: { product } })} className="w-full bg-amber-500 text-gray-950 font-black py-3.5 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95">
                    AI Review & Specs
                  </button>
                  <a 
                    href={product.link} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="block text-center border-2 border-gray-200 dark:border-white/10 py-3 rounded-full font-bold text-sm text-gray-600 dark:text-gray-300 hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all active:scale-95 bg-white/5 dark:bg-transparent"
                  >
                    View on {product.store}
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-32 glass-card max-w-lg mx-auto p-12 rounded-[3rem]">
            <p className="text-2xl font-bold text-gray-500">No active deals found for <br/><span className="text-amber-500 font-black">"{searchInput}"</span></p>
          </div>
        )}
      </main>
    </div>
  );
}