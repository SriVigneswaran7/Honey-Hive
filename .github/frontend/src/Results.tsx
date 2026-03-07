import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.query || 'Search';
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [products] = useState([
    { 
      title: "Casio fx-991DE CW Advanced Scientific Calculator", 
      price: "£29.99", 
      store: "Amazon", 
      thumbnail: "https://m.media-amazon.com/images/I/71e-0-vP-rL._AC_SL1500_.jpg",
      link: "https://amazon.co.uk"
    },
    { 
      title: "Texas Instruments TI-30X IIS Solar", 
      price: "£14.50", 
      store: "Tesco", 
      thumbnail: "https://m.media-amazon.com/images/I/81+m1+S+S6L._AC_SL1500_.jpg",
      link: "https://tesco.com"
    }
  ]);

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-20">
      {/* Navbar - Expanded to 95% */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
        <div className="w-[95%] mx-auto py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6">
            {/* Back Button */}
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-amber-500 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-400 cursor-pointer">
              Honey<span className="text-white">Hive</span>
            </div>
          </div>

          <button 
            onClick={() => isLoggedIn ? localStorage.removeItem('isLoggedIn') : navigate('/login')} 
            className="bg-amber-500 text-gray-950 px-6 py-2 rounded-full font-bold shadow-lg shadow-amber-500/20"
          >
            {isLoggedIn ? 'Log Out' : 'Log In'}
          </button>
        </div>
      </nav>

      {/* Main Content - Expanded to 95% */}
      <div className="w-[95%] mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-8 tracking-tight">
          Demo Results for <span className="text-amber-500">"{initialQuery}"</span>
        </h1>
        
        {/* Responsive Grid: 1 col on mobile, 2 on tablet, 3 on laptop, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500 transition-all flex flex-col p-4">
              <div className="h-64 bg-white rounded-xl mb-4 flex items-center justify-center p-6 relative">
                 <span className="absolute top-3 left-3 bg-gray-950 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.store}
                </span>
                <img src={product.thumbnail} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
              </div>
              
              <div className="flex flex-col flex-grow">
                <h3 className="font-bold text-xl text-white line-clamp-2 mb-2 leading-tight">{product.title}</h3>
                <div className="text-3xl font-black text-amber-400 mb-6">{product.price}</div>
                
                <div className="mt-auto flex flex-col gap-3">
                  <button 
                    onClick={() => navigate('/review', { state: { product } })}
                    className="w-full bg-amber-500 text-gray-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-lg"
                  >
                    View AI Analysis (Demo)
                  </button>
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="w-full text-center border-2 border-gray-800 text-gray-300 font-bold py-3 rounded-xl hover:text-white transition-colors">
                    View on {product.store}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}