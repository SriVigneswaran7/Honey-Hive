import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Clock, LogOut, Sun, Moon, X, Check, Tag, Copy, Loader2, ChevronRight } from 'lucide-react';

const SkeletonCard = () => (
  <div className="relative glass-card rounded-[2.5rem] p-5 flex flex-col border border-gray-200 dark:border-white/10 overflow-hidden h-[500px] animate-pulse">
    <div className="h-60 bg-gray-200 dark:bg-white/5 rounded-3xl mb-6 shadow-inner"></div>
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/5 rounded-full mb-2"></div>
    <div className="h-6 w-1/2 bg-gray-200 dark:bg-white/5 rounded-full mb-8"></div>
    <div className="h-10 w-1/3 bg-gray-200 dark:bg-white/5 rounded-full mb-8"></div>
import { User, Clock, LogOut, Sun, Moon, X, Check, Filter, ArrowUpDown } from 'lucide-react';

const SkeletonCard = () => (
  <div className="relative glass-card rounded-[2.5rem] p-5 flex flex-col border border-gray-200 dark:border-white/10 overflow-hidden h-[500px] animate-pulse">
    
    {/* Ghost Comparison Button */}
    <div className="absolute top-4 right-4 w-10 h-10 bg-gray-200 dark:bg-white/5 rounded-full z-20 shadow-sm"></div>

    {/* Ghost Image Area */}
    <div className="h-60 bg-gray-200 dark:bg-white/5 rounded-3xl mb-6 shadow-inner"></div>
    
    {/* Ghost Title Lines */}
    <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/5 rounded-full mb-2"></div>
    <div className="h-6 w-1/2 bg-gray-200 dark:bg-white/5 rounded-full mb-8"></div>
    
    {/* Ghost Price */}
    <div className="h-10 w-1/3 bg-gray-200 dark:bg-white/5 rounded-full mb-8"></div>
    
    {/* Ghost Buttons */}
    <div className="mt-auto space-y-3">
      <div className="h-[52px] w-full bg-gray-200 dark:bg-white/5 rounded-full"></div>
      <div className="h-[52px] w-full bg-gray-200 dark:bg-white/5 rounded-full"></div>
    </div>
  </div>
);

// Coupon Modal Component
const CouponModal = ({ product, onClose }: { product: any; onClose: () => void }) => {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:5000/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: product.link, store: product.store, title: product.title }),
        });
        const data = await res.json();
        if (data.error && data.codes?.length === 0) {
          setError(data.error);
        } else {
          setCodes(data.codes || []);
        }
      } catch (e) {
        setError('Failed to fetch codes. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchCodes();
  }, [product.link]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const confidenceConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
    high:   { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500', label: 'Best Bet' },
    medium: { color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',     dot: 'bg-amber-500',   label: 'Worth Trying' },
    low:    { color: 'text-gray-500 dark:text-gray-400',       bg: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10',                dot: 'bg-gray-400',    label: 'Unlikely' },
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg glass-card rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-7 pb-5 flex items-start justify-between border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <img src={product.thumbnail} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
            </div>
            <div>
              <h2 className="font-black text-lg text-gray-900 dark:text-white leading-tight line-clamp-1">
                Discount Codes
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 mt-0.5">
                {product.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all active:scale-90">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 pt-5 max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Tag size={18} className="absolute inset-0 m-auto text-amber-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-sm">Hunting for codes...</p>
                <p className="text-xs text-gray-400 mt-1">Scanning coupon sites & AI-ranking results</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <X size={24} className="text-red-400" />
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{error}</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🍯</div>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No codes found right now</p>
              <p className="text-xs text-gray-400 mt-1">This store may not have active public codes</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                {codes.length} code{codes.length !== 1 ? 's' : ''} found · AI-ranked for this product
              </p>
              {codes.map((item, i) => {
                const conf = confidenceConfig[item.confidence] || confidenceConfig.low;
                const isCopied = copied === item.code;
                return (
                  <div key={i} className={`group relative rounded-2xl border p-4 transition-all duration-200 ${conf.bg} hover:scale-[1.01]`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conf.dot}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-gray-900 dark:text-white text-base tracking-wide">
                              {item.code}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${conf.bg} ${conf.color}`}>
                              {conf.label}
                            </span>
                          </div>
                          {item.reason && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(item.code)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-90
                          ${isCopied
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white hover:shadow-lg hover:shadow-amber-500/20'
                          }`}
                      >
                        {isCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && codes.length > 0 && (
          <div className="px-7 pb-6 pt-2">
            <p className="text-[10px] text-gray-400 text-center">
              Copy a code and paste it at checkout · Codes ranked by AI for this specific product
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

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
  // Filtering & Sorting State
  const [selectedStore, setSelectedStore] = useState('All');
  const [sortOrder, setSortOrder] = useState<'default' | 'low-high' | 'high-low'>('default');
  // Comparison Logic States
  const [selectedForCompare, setSelectedForCompare] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isComparingLoading, setIsComparingLoading] = useState(false);
  const [trustScores, setTrustScores] = useState<Record<string, string>>({});
  const lastFetchedQuery = useRef<string | null>(null);
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState(''); 
  
  // NEW: Price Filter State
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecent = async () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail || !showProfileMenu) return;

  // Coupon Modal State
  const [couponProduct, setCouponProduct] = useState<any | null>(null);

  const recentSearches = [
    { id: 1, query: 'Sony WH-1000XM5' },
    { id: 2, query: 'Keychron K2 Keyboard' },
    { id: 3, query: 'LG C3 OLED TV 55"' },
  ];
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
    if (localStorage.getItem('isLoggedIn') === 'true') setIsLoggedIn(true);
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
    
    // Build dynamic cache key and URL based on current price states
    let cacheKey = `honeyhive_results_${query}`;
    let apiUrl = `http://127.0.0.1:8000/api/search?q=${encodeURIComponent(query)}`;
    
    const userEmail = localStorage.getItem('userEmail') || '';
    if (userEmail) apiUrl += `&user_email=${encodeURIComponent(userEmail)}`;
    
    if (minPrice) {
      cacheKey += `_min_${minPrice}`;
      apiUrl += `&min_price=${minPrice}`;
    }
    if (maxPrice) {
      cacheKey += `_max_${maxPrice}`;
      apiUrl += `&max_price=${maxPrice}`;
    }

    const cachedData = sessionStorage.getItem(cacheKey);
    if (cachedData) {
      setProducts(JSON.parse(cachedData));
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const resultsArray = data.shopping_results || [];
      setProducts(resultsArray);
      sessionStorage.setItem(cacheKey, JSON.stringify(resultsArray));
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (product: any) => {
    const isSelected = selectedForCompare.some(p => p.title === product.title);
    if (isSelected) {
      setSelectedForCompare(selectedForCompare.filter(p => p.title !== product.title));
    } else {
      if (selectedForCompare.length < 2) {
        setSelectedForCompare([...selectedForCompare, product]);
      } else {
        setSelectedForCompare([selectedForCompare[1], product]);
      }
    }
  };

  useEffect(() => {
    if (initialQuery && lastFetchedQuery.current !== initialQuery) {
      lastFetchedQuery.current = initialQuery; 
      fetchProducts(initialQuery);             
    }
  }, [initialQuery]);

  // Calculate unique stores for the dropdown
  const uniqueStores = ['All', ...Array.from(new Set(products.map(p => p.store)))];

  // Derived state: Filter first, then Sort
  const filteredProducts = products
    .filter(p => selectedStore === 'All' || p.store === selectedStore)
    .sort((a, b) => {
      if (sortOrder === 'default') return 0;
      
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
      
      return sortOrder === 'low-high' ? priceA - priceB : priceB - priceA;
    });

  return (
    <div className="animate-page min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 pb-20 relative z-10">

      {/* Coupon Modal */}
      {couponProduct && (
        <CouponModal product={couponProduct} onClose={() => setCouponProduct(null)} />
      )}

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="relative group p-2 transition-all active:scale-90"
            aria-label="Go Back"
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sessionStorage.removeItem(`honeyhive_results_${searchInput}`);
                  fetchProducts(searchInput);
                }
              }}
              className="w-full bg-transparent py-2 px-6 focus:outline-none font-medium text-sm text-gray-900 dark:text-white"
            />
            <button
              onClick={() => { sessionStorage.removeItem(`honeyhive_results_${searchInput}`); fetchProducts(searchInput); }}
              className="bg-amber-500 hover:bg-amber-400 text-gray-950 font-black px-6 py-2 rounded-full text-xs transition-all shadow-md active:scale-95"
            >
              Update
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="font-medium flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400" aria-label="Toggle Dark Mode">
          
          {/* New Filter Button in Navbar */}
          {!loading && products.length > 0 && (
            <button 
              onClick={() => setShowFilterModal(true)} 
              className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 relative"
              aria-label="Filters"
            >
              <Filter size={20} />
              {/* Red dot notification if a filter is active */}
              {(selectedStore !== 'All' || sortOrder !== 'default' || minPrice || maxPrice) && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-gray-950"></span>
              )}
            </button>
          )}

          <button 
            onClick={toggleTheme} 
            className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400"
            aria-label="Toggle Dark Mode"
          >
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
                              const query = item.product_url || item.query;
                              setSearchInput(query);
                              sessionStorage.removeItem(`honeyhive_results_${query}`);
                              fetchProducts(query);
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
            <button onClick={() => navigate('/login', { state: { from: location.pathname, query: searchInput } })} className="bg-amber-500 text-gray-950 px-8 py-2.5 rounded-full hover:bg-amber-400 transition-all font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105 active:scale-95 border border-amber-400/50">
              Log In
            </button>
          )}
        </div>
      </nav>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              // Checks selection status for this card
              const isSelected = selectedForCompare.some(p => p.title === product.title);
              return (
                <div key={index} className={`relative glass-card rounded-[2.5rem] p-5 flex flex-col border transition-all duration-500 group
                  ${isSelected
                    ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)] scale-[1.02]'
                    : 'border-gray-200 dark:border-white/10 hover:border-amber-500/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)]'}`}>

                  {/* Compare Button */}
                  <button
                    onClick={() => toggleCompare(product)}
                    className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90
                      ${isSelected ? 'bg-amber-500 text-gray-950 scale-110' : 'bg-white/80 dark:bg-gray-900/80 text-gray-400 hover:text-amber-500'}`}
                  >
                    {isSelected
                      ? <Check size={20} strokeWidth={3.5} className="animate-in zoom-in duration-200" />
                      : <span className="text-2xl font-normal leading-none mb-1">+</span>}
                  </button>

                  <div className="h-60 bg-white rounded-3xl p-6 flex items-center justify-center mb-6 shadow-inner relative overflow-hidden">
                    <span className="absolute top-4 left-4 bg-gray-950/90 text-amber-500 text-[10px] font-black px-3 py-1 rounded-full uppercase z-10 shadow-md">
                      {product.store}
                    </span>
                    <img src={product.thumbnail} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 leading-tight px-1">{product.title}</h3>
                  <div className="text-4xl font-black text-amber-500 mb-6 px-1 tracking-tighter">{product.price}</div>

                  <div className="mt-auto space-y-3">
                    <button
                      onClick={() => navigate('/review', { state: { product } })}
                      className="w-full bg-amber-500 text-gray-950 font-black py-3.5 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95"
                    >
                      AI Review & Specs
                    </button>

                    {/* Find Discount Codes Button */}
                    <button
                      onClick={() => setCouponProduct(product)}
                      className="w-full flex items-center justify-center gap-2 border-2 border-amber-500/30 py-3 rounded-full font-bold text-sm text-amber-600 dark:text-amber-400 hover:border-amber-500 hover:bg-amber-500/5 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all active:scale-95"
                    >
                      <Tag size={15} strokeWidth={2.5} />
                      Find Discount Codes
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
              );
            })}
          </div>
        ) : (
          <div className="text-center mt-32 glass-card max-w-lg mx-auto p-12 rounded-[3rem]">
            <p className="text-2xl font-bold text-gray-500">No active deals found for <br /><span className="text-amber-500 font-black">"{searchInput}"</span></p>
          </div>
        )}
      </main>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-24 sm:pt-32 pb-4 px-4 sm:px-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-950/60 backdrop-blur-md" onClick={() => setShowFilterModal(false)}></div>
          <div className="relative z-10 w-full max-w-md glass-card rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl">
            
            {/* Glow Effect inside the Glass */}
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-rose-500/20 dark:bg-rose-500/10 rounded-full blur-[80px] pointer-events-none z-0"></div>

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white/30 dark:bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Filter size={20} /></div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Filters & Sort</h2>
              </div>
              <button onClick={() => setShowFilterModal(false)} className="p-2 rounded-full text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all active:scale-90">
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Options Body */}
            <div className="relative z-10 p-8 space-y-8 overflow-y-auto max-h-[60vh]">
              
              {/* Store Options (Scrollable & Searchable) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Filter by Store</h3>
                  {selectedStore !== 'All' && (
                    <button 
                      onClick={() => setSelectedStore('All')} 
                      className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {/* Store Search Input */}
                <div className="relative mb-3 group/search">
                  <input 
                    type="text" 
                    placeholder="Search stores..." 
                    value={storeSearchQuery}
                    onChange={(e) => setStoreSearchQuery(e.target.value)}
                    className="w-full bg-white/30 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm text-gray-900 dark:text-white placeholder:text-gray-400 backdrop-blur-md"
                  />
                  {storeSearchQuery && (
                    <button 
                      onClick={() => setStoreSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Vertical Scroll Box */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 pb-2 selection:bg-amber-500/30">
                  {uniqueStores
                    .filter(store => store.toLowerCase().includes(storeSearchQuery.toLowerCase()))
                    .map(store => (
                    <button
                      key={store}
                      onClick={() => setSelectedStore(store)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border backdrop-blur-md
                        ${selectedStore === store 
                          ? 'bg-amber-500 border-amber-500 text-gray-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                          : 'bg-white/30 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-amber-500/50 hover:text-amber-500'}`}
                    >
                      {store}
                    </button>
                  ))}
                  
                  {/* Empty State if search yields no results */}
                  {uniqueStores.filter(store => store.toLowerCase().includes(storeSearchQuery.toLowerCase())).length === 0 && (
                    <div className="w-full py-4 text-center text-sm font-medium text-gray-500">
                      No stores found matching "{storeSearchQuery}"
                    </div>
                  )}
                </div>
              </div>

              {/* Price Range Options */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                  Price Range <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[8px]">New Search</span>
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-full group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black group-focus-within/input:text-amber-500 transition-colors">£</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-white/30 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold text-sm text-gray-900 dark:text-white backdrop-blur-md"
                    />
                  </div>
                  <span className="text-gray-400 font-bold">-</span>
                  <div className="relative w-full group/input">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black group-focus-within/input:text-amber-500 transition-colors">£</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-white/30 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3 pl-8 pr-4 focus:outline-none focus:border-amber-500 transition-all font-bold text-sm text-gray-900 dark:text-white backdrop-blur-md"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Sort Results</h3>
                <div className="flex flex-col gap-3">
                  {[
                    { id: 'default', label: 'Default Match' },
                    { id: 'low-high', label: 'Price: Low to High' },
                    { id: 'high-low', label: 'Price: High to Low' }
                  ].map(option => (
                    <button
                      key={option.id}
                      onClick={() => setSortOrder(option.id as any)}
                      className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all border flex items-center justify-between backdrop-blur-md
                        ${sortOrder === option.id 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-500 dark:text-amber-400' 
                          : 'bg-white/40 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-amber-500/50 hover:text-amber-500'}`}
                    >
                      {option.label}
                      {sortOrder === option.id && <Check size={18} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 p-6 bg-white/30 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 backdrop-blur-md">
              <button 
                onClick={() => {
                  setShowFilterModal(false);
                  fetchProducts(searchInput); 
                }}
                className="w-full bg-amber-500 text-gray-950 font-black py-4 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95 text-lg"
              >
                Apply & View Results
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Floating Compare Bar */}
      {selectedForCompare.length > 0 && (
        <div className="fixed top-28 right-6 lg:right-12 z-[100] animate-in slide-in-from-right-10 fade-in duration-500">
          <div className="rounded-full p-2.5 border border-amber-500/40 dark:border-amber-500/30 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 px-6 bg-white/60 dark:bg-gray-900/40 backdrop-blur-2xl">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {selectedForCompare.map((p, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-amber-500/80 dark:border-amber-500 bg-white/80 overflow-hidden shadow-md dark:shadow-xl">
                    <img src={p.thumbnail} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white hidden sm:block">
                {selectedForCompare.length === 1 ? 'Add one more' : 'Ready!'}
              </p>
            </div>
            <div className="flex items-center gap-4 border-l border-gray-300/50 dark:border-white/10 pl-4">
              <button onClick={() => setSelectedForCompare([])} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                Clear
              </button>
              <button
                disabled={selectedForCompare.length < 2}
                onClick={async () => {
                  setShowCompareModal(true);
                  setIsComparingLoading(true);
                  try {
                    const stores = selectedForCompare.map(p => p.store);
                    const res = await fetch('http://127.0.0.1:8000/api/trust', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ stores })
                    });
                    const data = await res.json();
                    setTrustScores(data.trust_scores || {});
                  } catch (err) {
                    console.error("Failed to fetch trust scores", err);
                  } finally {
                    setIsComparingLoading(false);
                  }
                }}
                className={`px-6 py-2.5 rounded-full font-black transition-all active:scale-95 shadow-lg text-sm
                  ${selectedForCompare.length === 2
                    ? 'bg-amber-500 text-gray-950 hover:bg-amber-400'
                    : 'bg-white/50 text-gray-400 dark:bg-white/10 dark:text-gray-500 cursor-not-allowed border border-white/40 dark:border-transparent'}`}
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-950/60 backdrop-blur-lg" onClick={() => setShowCompareModal(false)}></div>
          <div className="relative z-10 w-full max-w-5xl glass-card rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl">
            <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-500/20 dark:bg-rose-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="relative z-10 p-8 border-b border-white/50 dark:border-white/10 flex justify-between items-center bg-white/30 dark:bg-white/5 backdrop-blur-md">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-amber-500 drop-shadow-sm">Product Battle</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Side-by-side comparison</p>
              </div>
              <button onClick={() => setShowCompareModal(false)} className="p-3 rounded-full text-gray-600 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-500 hover:bg-amber-500/10 transition-all duration-300 active:scale-90">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            <div className="relative z-10 flex-1 overflow-y-auto p-8 selection:bg-amber-500/20">
              <div className="grid grid-cols-2 gap-8 h-full">
                {selectedForCompare.map((product, idx) => {
                  const ratingValue = product.rating !== "N/A" ? product.rating : "No Rating";
                  const reviewCount = product.reviews || 0;
                  const storeName = product.store || "Unknown";
                  return (
                    <div key={idx} className="flex flex-col">
                      <div className="glass-card rounded-[2rem] p-6 bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/5 mb-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
                        <div className="h-48 flex items-center justify-center mb-4 bg-white/40 dark:bg-transparent rounded-2xl p-4">
                          <img src={product.thumbnail} alt="" className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <h3 className="font-bold text-lg leading-tight mb-2 truncate text-gray-900 dark:text-white px-2">{product.title}</h3>
                        <div className="text-3xl font-black text-amber-500 tracking-tighter px-2 drop-shadow-sm">{product.price}</div>
                      </div>
                      <div className="space-y-4">
                        <div className="glass-card p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/5 backdrop-blur-md flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/80 dark:text-amber-500/50">Store</p>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{product.store}</p>
                        </div>
                        <div className="glass-card p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/5 backdrop-blur-md flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/80 dark:text-amber-500/50">AI Trust Score</p>
                          {isComparingLoading ? (
                            <div className="h-5 w-24 bg-gray-300 dark:bg-white/10 rounded-full animate-pulse"></div>
                          ) : (() => {
                            const score = trustScores[storeName] || "Moderate";
                            if (score === "High") return <p className="font-bold text-green-600 dark:text-green-400 text-sm flex items-center gap-1.5"><Check size={14} /> High Reliability</p>;
                            if (score === "Low") return <p className="font-bold text-red-600 dark:text-red-400 text-sm">Low Reliability</p>;
                            return <p className="font-bold text-amber-600 dark:text-amber-400 text-sm">Moderate Reliability</p>;
                          })()}
                        </div>
                        <div className="glass-card p-4 rounded-2xl bg-white/30 dark:bg-white/5 border border-white/60 dark:border-white/5 backdrop-blur-md flex justify-between items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600/80 dark:text-amber-500/50">Avg. Rating</p>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1">
                              {ratingValue} {ratingValue !== "No Rating" && <span className="text-amber-500">★</span>}
                            </p>
                            {reviewCount > 0 && <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">({reviewCount})</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative z-20 p-8 bg-amber-500 text-gray-950 flex items-center justify-between shadow-[0_-10px_40px_rgba(245,158,11,0.2)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-950 flex items-center justify-center shadow-lg">
                  <div className="w-7 h-7 bg-amber-500 rounded-full blur-[2px] animate-pulse"></div>
                </div>
                <p className="font-bold text-sm max-w-md">The HoneyHive AI identifies the most competitive value based on your current search criteria.</p>
              </div>
              <button
                onClick={() => {
                  const price1 = parseFloat(selectedForCompare[0].price.replace(/[^0-9.]/g, ''));
                  const price2 = parseFloat(selectedForCompare[1].price.replace(/[^0-9.]/g, ''));
                  const bestDeal = price1 <= price2 ? selectedForCompare[0] : selectedForCompare[1];
                  window.open(bestDeal.link, '_blank');
                }}
                className="bg-gray-950 text-white px-8 py-3 rounded-full font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                Buy Best Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}