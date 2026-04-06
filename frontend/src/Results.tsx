import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Clock, LogOut, Sun, Moon, Check, Tag, Filter } from 'lucide-react';
import CouponModal from './Coupons';
import FilterModal from './Filters';
import CompareModal from './Comparison';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
      <div className="h-[52px] w-full bg-gray-200 dark:bg-white/5 rounded-full"></div>
    </div>
  </div>
);

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef<any>(null);

  const initialQuery = location.state?.query || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  // Filtering & Sorting State
  const [selectedStore, setSelectedStore] = useState('All');
  const [sortOrder, setSortOrder] = useState('default');
  
  // Comparison Logic States
  const [selectedForCompare, setSelectedForCompare] = useState<any[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [isComparingLoading, setIsComparingLoading] = useState(false);
  const [trustScores, setTrustScores] = useState<any>({});
  const lastFetchedQuery = useRef<any>(null);
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [storeSearchQuery, setStoreSearchQuery] = useState(''); 
  
  // NEW: Price Filter State
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  // Coupon Modal State
  const [couponProduct, setCouponProduct] = useState<any>(null);

  useEffect(() => {
    const fetchRecent = async () => {
      const token = localStorage.getItem('authToken');
      if (!token || !showProfileMenu) return;

      try {
        const response = await fetch(`${API_BASE}/auth/history`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error("Unauthorized");
        
        const data = await response.json();
        if (data.history) {
          setRecentSearches(data.history.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch recent searches", error);
        if (error instanceof Error && error.message === "Unauthorized") {
           localStorage.removeItem('isLoggedIn');
           localStorage.removeItem('authToken');
           navigate('/login');
        }
      }
    };

    fetchRecent();
  }, [showProfileMenu]);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') setIsLoggedIn(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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

  const fetchProducts = async (query: any) => {
    if (!query) return;
    
    const userEmail = location.state?.userEmail || localStorage.getItem('userEmail') || '';
    
    // Build dynamic cache key and URL based on current price states
    let cacheKey = `honeyhive_results_${query}_${userEmail}`;
    let apiUrl = `${API_BASE}/api/search?q=${encodeURIComponent(query)}`;

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
  const uniqueStores = ['All', ...Array.from(new Set(products.map((p: any) => p.store)))];

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

      {/* Coupon Modal via explicit file */}
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
          <div className="flex items-center gap-4">
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

      {/* Filter Modal via explicit file */}
      {showFilterModal && (
        <FilterModal 
          onClose={() => setShowFilterModal(false)}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          uniqueStores={uniqueStores}
          storeSearchQuery={storeSearchQuery}
          setStoreSearchQuery={setStoreSearchQuery}
          onApply={() => {
            setShowFilterModal(false);
            fetchProducts(searchInput); 
          }}
        />
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
                    const res = await fetch(`${API_BASE}/api/trust`, {
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

      {/* Compare Modal via explicit file */}
      <CompareModal
        showCompareModal={showCompareModal}
        setShowCompareModal={setShowCompareModal}
        selectedForCompare={selectedForCompare}
        isComparingLoading={isComparingLoading}
        trustScores={trustScores}
      />
    </div>
  );
}