import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userState = localStorage.getItem('hive_user_logged_in');
    if (userState === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending to backend engine:", searchQuery);
  };

  const handleLogout = () => {
   
    localStorage.removeItem('hive_user_logged_in');
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30">
      
      
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-amber-400 cursor-pointer">
          Honey<span className="text-white">Hive</span>
        </div>
        <div className="font-medium flex gap-4">
          
          
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-gray-400 hover:text-amber-500 transition-colors font-bold px-4 py-2"
            >
              Log Out
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full hover:bg-amber-400 transition-colors font-bold shadow-lg shadow-amber-500/20"
            >
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