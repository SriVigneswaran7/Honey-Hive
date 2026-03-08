import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, LogOut } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const recentSearches = [
    { id: 1, query: 'Sony WH-1000XM5' },
    { id: 2, query: 'Keychron K2 Keyboard' },
    { id: 3, query: 'LG C3 OLED TV 55"' },
  ];

  // Check the backpack as soon as the Home screen loads
  useEffect(() => {
    const userStatus = localStorage.getItem('isLoggedIn');
    if (userStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

 const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
    try {
    const response = await fetch("http://localhost:5000/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: searchQuery }),
    });

    const data = await response.json();

    console.log("Python returned:", data);

    navigate("/results", { state: { query: searchQuery, result: data } });

  } catch (error) {
    console.error("Error contacting backend:", error);
  }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30">
      
      
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-amber-400 cursor-pointer">
          Honey<span className="text-white">Hive</span>
        </div>
        <div className="font-medium flex gap-4">
          
          
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              
              <span className="text-gray-200 font-bold tracking-wide">
                Hi, HoneyUser!
              </span>

              <div className="relative z-50">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-3 rounded-full bg-amber-500 text-gray-950 hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-amber-500 shadow-lg shadow-amber-500/20"
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
            </div>
          ) : (
            <button onClick={() => navigate('/login')} className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full hover:bg-amber-400 transition-colors font-bold shadow-lg shadow-amber-500/20">
              Log In
            </button>
          )}

        </div>
      </nav>

      
      <main className="flex flex-col items-center justify-center mt-32 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Find the <span className="text-amber-500">sweetest deals.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl">
          Search millions of products. Get real-time UK prices, live availability, and brutal AI tech reviews instantly.
        </p>

        
        <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Paste a product link or search by name..."
            className="w-full bg-gray-900 border-2 border-gray-800 text-white text-lg rounded-full py-5 pl-8 pr-36 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-2xl"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-8 rounded-full transition-colors"
          >
            Search
          </button>
        </form>
        
      </main>
    </div>
  );
}