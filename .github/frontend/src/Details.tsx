import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Details() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Grabs the specific product the user clicked on
  const product = location.state?.product;

  const [insights, setInsights] = useState<any>(null);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 1. ADDS THE MEMORY STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 2. CHECKS THE DATABASE WHEN SCREEN LOADS
  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // 3. ADDS THE LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    navigate('/'); // Navigates back to Home
  };

  useEffect(() => {
    if (!product) return;

    const fetchAIData = async () => {
      setLoading(true);
      try {
        // Change this URL to the Python AI/Coupon endpoint
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
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Safety if a user accidentally navigates here without clicking a product
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white">
        <h2 className="text-2xl mb-4">No product selected.</h2>
        <button onClick={() => navigate(-1)} className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30 pb-20">
      
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
        <div className="w-[95%] mx-auto py-4 flex items-center justify-between gap-4">
          
          {/* Left Side: Back Arrow & Logo */}
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-amber-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-400 cursor-pointer">
              Honey<span className="text-white">Hive</span>
            </div>
          </div>

          {/* Right Side: Dynamic Auth Buttons */}
          <div className="flex items-center flex-shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-6">
                <button onClick={() => navigate('/history')} className="text-gray-300 hover:text-amber-500 transition-colors flex items-center gap-2 font-bold">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="hidden sm:inline">History</span>
                </button>
                <button onClick={handleLogout} className="text-gray-500 hover:text-white transition-colors text-sm font-semibold">
                  Log Out
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full hover:bg-amber-400 transition-colors font-bold text-sm shadow-lg shadow-amber-500/20">
                Log In
              </button>
            )}
          </div>

        </div>
      </nav>

      <main className="w-[95%] mx-auto mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Product Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-8 flex items-center justify-center border-4 border-gray-900 shadow-2xl relative">
               <span className="absolute top-4 left-4 bg-gray-950 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.store}
                </span>
              <img src={product.thumbnail} alt={product.title} className="w-full max-h-80 object-contain mix-blend-multiply" />
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
              <h1 className="text-2xl font-bold text-white leading-snug mb-4">{product.title}</h1>
              <div className="text-4xl font-black text-amber-400 mb-8">{product.price}</div>
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-amber-500 text-gray-950 font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors text-lg">
                Buy on {product.store}
              </a>
            </div>
          </div>

          {/* Right Column: AI & Coupons */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {loading ? (
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center justify-center h-full text-amber-500 font-bold animate-pulse">
                Gemini AI is analyzing reviews and hunting for coupons...
              </div>
            ) : (
              <>
                {/* AI Verdict Card */}
                {insights && (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight">AI Verdict</h2>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10">{insights.summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div className="bg-gray-950/50 rounded-2xl p-6 border border-gray-800/50">
                        <h3 className="text-green-400 font-bold text-lg mb-4">Pros</h3>
                        <ul className="space-y-3">
                          {insights.pros.map((pro: string, i: number) => <li key={i} className="text-gray-300"><span className="text-green-500 mr-2">•</span>{pro}</li>)}
                        </ul>
                      </div>
                      <div className="bg-gray-950/50 rounded-2xl p-6 border border-gray-800/50">
                        <h3 className="text-red-400 font-bold text-lg mb-4">Cons</h3>
                        <ul className="space-y-3">
                          {insights.cons.map((con: string, i: number) => <li key={i} className="text-gray-300"><span className="text-red-500 mr-2">•</span>{con}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active Coupons Card */}
                {coupons.length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                      <h2 className="text-2xl font-extrabold text-white tracking-tight">Active Offers</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      {coupons.map((coupon, idx) => (
                        <div key={idx} className="bg-gray-950 rounded-2xl p-5 border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex-1">
                            <h3 className="text-amber-400 font-bold text-lg">{coupon.title}</h3>
                            <p className="text-gray-400 text-sm mt-1">{coupon.description}</p>
                          </div>
                          <div className="flex w-full sm:w-auto mt-2 sm:mt-0 shadow-lg">
                            <div className="border-2 border-dashed border-gray-600 bg-[#1a1a1a] text-white px-4 py-3 rounded-l-xl font-mono tracking-widest text-center min-w-[120px]">{coupon.code}</div>
                            <button onClick={() => handleCopyCode(coupon.code)} className={`px-5 py-3 rounded-r-xl font-bold transition-all ${copiedCode === coupon.code ? 'bg-green-500 text-gray-950' : 'bg-amber-500 text-gray-950'}`}>{copiedCode === coupon.code ? 'Copied!' : 'Copy'}</button>
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