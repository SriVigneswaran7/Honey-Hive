import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const navigate = useNavigate();

  // Temporary: This mock data will be replaced by a live database fetch later.
  const [pastSearches] = useState([
    { id: 1, query: 'Sony WH-1000XM5 Wireless Headphones', date: '2026-03-08', dealsFound: 4 },
    { id: 2, query: 'Keychron K2 Mechanical Keyboard', date: '2026-03-07', dealsFound: 2 },
    { id: 3, query: 'LG C3 OLED TV 55"', date: '2026-03-05', dealsFound: 7 },
  ]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-amber-500/30 p-8">
      
      
      <nav className="max-w-4xl mx-auto flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-amber-500 transition-colors flex items-center gap-2 font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </button>
        <div className="text-xl font-black tracking-tighter text-amber-400">
          Honey<span className="text-white">Hive</span>
        </div>
      </nav>

      
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Your <span className="text-amber-500">History.</span>
        </h1>
        <p className="text-gray-400 mb-8">Review your past searches and tracked deals.</p>

        <div className="bg-gray-900 border-2 border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          {pastSearches.length > 0 ? (
            <ul className="divide-y divide-gray-800">
              {pastSearches.map((item) => (
                <li key={item.id} className="p-6 hover:bg-gray-800/50 transition-colors flex items-center justify-between group cursor-pointer">
                  <div>
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-amber-500 transition-colors">{item.query}</h3>
                    <p className="text-sm text-gray-500 mt-1">Searched on {item.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-amber-500/10 text-amber-500 py-1 px-3 rounded-full text-sm font-bold border border-amber-500/20">
                      {item.dealsFound} Deals
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 group-hover:text-amber-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-10 text-center text-gray-500 font-medium">
              No search history found. Start hunting for deals!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}