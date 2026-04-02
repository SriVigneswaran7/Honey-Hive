import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Filter, X, Check } from 'lucide-react';

export default function FilterModal({
  onClose,
  selectedStore,
  setSelectedStore,
  sortOrder,
  setSortOrder,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  uniqueStores,
  storeSearchQuery,
  setStoreSearchQuery,
  onApply
}: any) {
  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 sm:pt-32 pb-4 px-4 sm:px-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-950/60 backdrop-blur-md" onClick={onClose}></div>
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
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all active:scale-90">
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
                .filter((store: string) => store.toLowerCase().includes(storeSearchQuery.toLowerCase()))
                .map((store: string) => (
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
              {uniqueStores.filter((store: string) => store.toLowerCase().includes(storeSearchQuery.toLowerCase())).length === 0 && (
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
                  onClick={() => setSortOrder(option.id)}
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
            onClick={onApply}
            className="w-full bg-amber-500 text-gray-950 font-black py-4 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95 text-lg"
          >
            Apply & View Results
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}