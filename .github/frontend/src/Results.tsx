import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Clock, LogOut } from 'lucide-react';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialQuery = location.state?.query || '';

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const recentSearches = [
    { id: 1, query: 'Sony WH-1000XM5' },
    { id: 2, query: 'Keychron K2 Keyboard' },
    { id: 3, query: 'LG C3 OLED TV 55"' },
  ];

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); 
  };

  const fetchProducts = async (query: string) => {
    if (!query) return;

    // Cache Check
    const cachedData = sessionStorage.getItem(`honeyhive_results_${query}`);
    if (cachedData) {
      console.log("Loading from cache - Saved SerpApi credit!");
      setProducts(JSON.parse(cachedData));
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      const resultsArray = data.shopping_results || [];

      setProducts(resultsArray);
      
      // Saves to Cache
      sessionStorage.setItem(`honeyhive_results_${query}`, JSON.stringify(resultsArray));

    } catch (error) {
      console.error("Failed to fetch products from backend", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      fetchProducts(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30 pb-20">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
        <div className="w-[95%] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-amber-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-400 cursor-pointer hidden sm:block">
              Honey<span className="text-white">Hive</span>
            </div>
          </div>

          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-gray-950 border-2 border-gray-800 text-white rounded-full py-2 pl-6 pr-24 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            <button
              onClick={() => {
                // Wipes cache for new results
                sessionStorage.removeItem(`honeyhive_results_${searchInput}`);
                fetchProducts(searchInput);
              }}
              className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-4 rounded-full transition-colors text-sm"
            >
              Update
            </button>
          </div>

          <div className="flex items-center flex-shrink-0">
            {isLoggedIn ? (
              <div className="relative z-50">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-3 rounded-full bg-amber-500 text-gray-950 hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-amber-500 shadow-lg shadow-amber-500/20"
                >
                  <User size={24} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-4 w-72 bg-gray-900 border-2 border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-800 bg-gray-950/50">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                      <p className="font-bold text-white truncate text-sm">user@honeyhive.com</p>
                    </div>
                    
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Searches</div>
                      {recentSearches.map((item) => (
                        <button key={item.id} className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:text-amber-500 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-3">
                          <Clock size={14} className="opacity-50" />
                          <span className="truncate">{item.query}</span>
                        </button>
                      ))}
                      <button onClick={() => navigate('/history')} className="w-full text-center px-3 py-2 mt-2 text-sm text-amber-500 font-bold hover:bg-amber-500/10 rounded-lg transition-colors">
                        View All History
                      </button>
                    </div>

                    <div className="p-2 border-t border-gray-800">
                      <button onClick={() => { setShowProfileMenu(false); handleLogout(); }} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors flex items-center gap-3 font-bold">
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full hover:bg-amber-400 transition-colors font-bold text-sm shadow-lg shadow-amber-500/20">
                Log In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="w-[95%] mx-auto px-6 mt-10">
        {loading ? (
          <div className="text-amber-500 text-xl font-bold animate-pulse text-center mt-20">
            Scraping the web for the best deals...
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500 transition-all flex flex-col">
                <div className="h-64 bg-white p-6 flex items-center justify-center relative">
                  <span className="absolute top-3 left-3 bg-gray-950 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {product.store}
                  </span>
                  <img src={product.thumbnail} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-white line-clamp-2 mb-2">{product.title}</h3>
                  <div className="text-3xl font-black text-amber-400 mb-6">{product.price}</div>
                  <div className="mt-auto flex flex-col gap-3">
                    <button
                      onClick={() => navigate('/review', { state: { product } })}
                      className="w-full bg-amber-500 text-gray-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors"
                    >
                      AI Review & Specs
                    </button>
                    <a 
                      href={product.link || "#"} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full text-center border-2 border-gray-800 text-gray-300 font-bold py-3 rounded-xl hover:border-amber-500 hover:text-amber-500 transition-colors"
                    >
                      View on {product.store || 'Store'}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-xl font-bold text-center mt-20">
            No active deals found. Try a different search.
          </div>
        )}
      </main>
    </div>
  );
}