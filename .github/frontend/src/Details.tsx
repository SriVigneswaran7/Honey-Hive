import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Clock, LogOut, Sun, Moon, Sparkles, Ticket } from 'lucide-react';

const InsightSkeleton = () => (
  <div className="glass-card rounded-[2.5rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden h-[600px]">
    {/* Animated Shimmer Sweep */}
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-amber-500/5 to-transparent"></div>
    
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gray-200 dark:bg-white/5 rounded-2xl"></div>
        <div className="h-10 w-48 bg-gray-200 dark:bg-white/5 rounded-full"></div>
      </div>

      {/* Summary Paragraph Skeleton */}
      <div className="space-y-3 mb-12">
        <div className="h-6 w-full bg-gray-200 dark:bg-white/5 rounded-full"></div>
        <div className="h-6 w-5/6 bg-gray-200 dark:bg-white/5 rounded-full"></div>
        <div className="h-6 w-4/6 bg-gray-200 dark:bg-white/5 rounded-full"></div>
      </div>

      {/* Pros & Cons Columns Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-[2rem]"></div>
        <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-[2rem]"></div>
      </div>
    </div>
  </div>
);

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const product = location.state?.product;

  const [insights, setInsights] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  useEffect(() => {
    if (!product) return;
    const fetchAIData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productTitle: product.title })
        });
        const data = await response.json();
        setInsights(data.insights);
        setCoupons(data.coupons || []);
      } catch (error) {
        console.error("Failed to fetch AI insights", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAIData();
  }, [product]);

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    navigator.clipboard.writeText(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center">
        <h2 className="text-2xl mb-4 font-bold">No product selected.</h2>
        <button onClick={() => navigate(-1)} className="bg-amber-500 text-gray-950 px-8 py-3 rounded-full font-black shadow-lg">Go Back</button>
      </div>
    );
  }

  return (
    <div className="animate-page min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 pb-20 relative z-10">
      
      {/* Navbar - Unified Hive Design */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="relative group p-2 transition-all active:scale-90" aria-label="Go Back">
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
        
        <div className="font-medium flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 mr-2">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="p-3 rounded-full bg-amber-500 text-gray-950 hover:bg-amber-400 transition-all hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] relative z-50">
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
                        <button key={item.id} className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-amber-500 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center gap-3">
                          <Clock size={14} className="opacity-50" />
                          <span className="truncate">{item.query}</span>
                        </button>
                      ))}
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
              onClick={() => navigate('/login', { state: { from: location.pathname, product: product } })} 
              className="bg-amber-500 text-gray-950 px-8 py-2.5 rounded-full hover:bg-amber-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 border border-amber-400/50"
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Product Media Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-[2.5rem] p-8 flex items-center justify-center border border-gray-200 dark:border-white/10 relative overflow-hidden group">
               <span className="absolute top-6 left-6 bg-gray-900/90 text-amber-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg z-10">
                  {product.store}
                </span>
              <img src={product.thumbnail} alt="" className="w-full max-h-96 object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div className="glass-card rounded-[2.5rem] p-8 border border-gray-200 dark:border-white/10 shadow-xl">
              <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-4 tracking-tighter">{product.title}</h1>
              <div className="text-5xl font-black text-amber-500 mb-8 tracking-tighter">{product.price}</div>
              <a 
                href={product.link || product.shopping_portal_link || "#"} 
                target="_blank" rel="noreferrer"
                className="block w-full text-center bg-amber-500 text-gray-950 font-black py-5 rounded-full hover:bg-amber-400 transition-all text-xl shadow-lg shadow-amber-500/20 active:scale-95"
              >
                Buy on {product.store}
              </a>
            </div>
          </div>

          {/* Right: AI Insights & Coupons */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {loading ? (
              <div className="flex flex-col gap-8">
                <InsightSkeleton />
                {/* Optional: Add a small skeleton for coupons if you want, 
                    but just showing the AI Verdict skeleton usually looks best */}
              </div>
            ) : (
              <>
                {insights && (
                  <div className="glass-card rounded-[2.5rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                    
                    {/* THE TWO-LAYER AI PULSE ENGINE */}
                    <div className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {/* LAYER 2 (The Engine): Always breathing in the background, only seen when group is hovered */}
                      <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-[80px] animate-pulse"></div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                      <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Sparkles size={32} /></div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">AI Verdict</h2>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed mb-10 font-medium relative z-10">{insights.summary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                      <div className="bg-white/50 dark:bg-white/5 rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                        <h3 className="text-green-500 font-black text-lg uppercase tracking-widest mb-4">Pros</h3>
                        <ul className="space-y-3">
                          {insights.pros.map((pro: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 font-medium">
                              <span className="text-green-500 mt-1">●</span>{pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-white/50 dark:bg-white/5 rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                        <h3 className="text-red-500 font-black text-lg uppercase tracking-widest mb-4">Cons</h3>
                        <ul className="space-y-3">
                          {insights.cons.map((con: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 font-medium">
                              <span className="text-red-500 mt-1">●</span>{con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {coupons.length > 0 && (
                  <div className="glass-card rounded-[2.5rem] p-10 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="p-3 bg-green-500/10 rounded-2xl text-green-500"><Ticket size={32} /></div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">Active Offers</h2>
                    </div>
                    
                    <div className="space-y-4">
                      {coupons.map((coupon, idx) => (
                        <div key={idx} className="bg-white/50 dark:bg-white/5 rounded-[2rem] p-6 border border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 group hover:border-amber-500/30 transition-all">
                          <div className="text-center sm:text-left">
                            <h3 className="text-amber-500 font-black text-xl tracking-tight">{coupon.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">{coupon.description}</p>
                          </div>
                          <div className="flex shadow-2xl rounded-2xl overflow-hidden border-2 border-amber-500/50">
                            <div className="bg-gray-100 dark:bg-gray-900 px-6 py-3 font-mono font-bold tracking-[0.2em] text-lg">{coupon.code}</div>
                            <button 
                              onClick={() => handleCopyCode(coupon.code)} 
                              className={`px-8 py-3 font-black transition-all active:scale-95 ${copiedCode === coupon.code ? 'bg-green-500 text-gray-950' : 'bg-amber-500 text-gray-950'}`}
                            >
                              {copiedCode === coupon.code ? 'COPIED!' : 'COPY'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}