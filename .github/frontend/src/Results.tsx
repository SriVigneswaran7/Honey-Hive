import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Results() {
const navigate = useNavigate();
const location = useLocation();

// Grabs the search word from the Home screen, or default to a blank string
const initialQuery = location.state?.query || '';

const [searchInput, setSearchInput] = useState(initialQuery);
const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

// 1. ADDS THE MEMORY STATE
const [isLoggedIn, setIsLoggedIn] = useState(false);

// 2. CHECKS THE DATABASE WHEN SCREEN LOADS
useEffect(() => {
if (localStorage.getItem('isLoggedIn') === 'true') {
setIsLoggedIn(true);
}
}, []);

// 3. ADD THE LOGOUT FUNCTION
const handleLogout = () => {
localStorage.removeItem('isLoggedIn');
setIsLoggedIn(false);
navigate('/'); // Navigates back to Home Screen
};

// The function that connects to Python Backend
const fetchProducts = async (query: string) => {
if (!query) return;
setLoading(true);
try {
// Change this URL to the actual Python API endpoint
const response = await fetch(`http://127.0.0.1:5000/api/search?q=${query}`);
const data = await response.json();

setProducts(data.shopping_results || []);
} catch (error) {
console.error("Failed to fetch products from backend", error);
} finally {
setLoading(false);
}
};

// Runs the fetch automatically when the page first loads
useEffect(() => {
fetchProducts(initialQuery);
}, []);

return (
<div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30 pb-20">

{/* Navbar */}
<nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-xl">
<div className="w-[95%] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

{/* Left Side: Back Arrow & Logo */}
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

{/* Middle: The Search Bar */}
<div className="w-full max-w-2xl relative">
<input
type="text"
value={searchInput}
onChange={(e) => setSearchInput(e.target.value)}
className="w-full bg-gray-950 border-2 border-gray-800 text-white rounded-full py-2 pl-6 pr-24 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
/>
<button
onClick={() => fetchProducts(searchInput)}
className="absolute right-1 top-1 bottom-1 bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold px-4 rounded-full transition-colors text-sm"
>
Update
</button>
</div>

{/* Right Side: Dynamic Auth Buttons */}
<div className="flex items-center flex-shrink-0">
{isLoggedIn ? (
<div className="flex items-center gap-6">
<button onClick={() => navigate('/history')} className="text-gray-300 hover:text-amber-500 transition-colors flex items-center gap-2 font-bold">
<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
<span className="hidden lg:inline">History</span>
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

{/* Page Header */}
<div className="w-[95%] mx-auto px-6 mt-10 mb-8">
<h1 className="text-3xl font-bold">
Top deals for <span className="text-amber-500">"{searchInput}"</span>
</h1>
</div>

{/* Main Grid Content */}
<main className="w-[95%] mx-auto px-6">
{loading ? (
<div className="text-amber-500 text-xl font-bold animate-pulse text-center mt-20">
Scraping the web for the best deals...
</div>
) : (
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
{products.map((product, index) => (
<div key={index} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-500 transition-all flex flex-col">
<div className="h-64 bg-white p-6 flex items-center justify-center relative">
<span className="absolute top-3 left-3 bg-gray-950 text-amber-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
{product.store}
</span>
<img src={product.thumbnail} alt={product.title} className="max-h-full max-w-full object-contain mix-blend-multiply" />
</div>
<div className="p-6 flex flex-col flex-grow">
<h3 className="text-xl font-semibold text-white line-clamp-2 mb-2">{product.title}</h3>
<div className="text-3xl font-black text-amber-400 mb-6">{product.price}</div>
<div className="mt-auto flex flex-col gap-3">
<button
// Passes the exact product object over to the Details screen
onClick={() => navigate('/review', { state: { product } })}
className="w-full bg-amber-500 text-gray-950 font-bold py-3 rounded-xl hover:bg-amber-400 transition-colors"
>
AI Review & Specs
</button>
<a href={product.link} target="_blank" rel="noopener noreferrer" className="w-full text-center border-2 border-gray-800 text-gray-300 font-bold py-3 rounded-xl hover:text-white transition-colors">
View on {product.store}
</a>
</div>
</div>
</div>
))}
</div>
)}
</main>
</div>
);
}
