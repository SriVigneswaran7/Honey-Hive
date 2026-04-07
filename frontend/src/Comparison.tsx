import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

/**
 * A modal component that renders a side-by-side product comparison using a React Portal.
 * Displays product details, prices, ratings, and AI-generated store trust scores.
 * * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.showCompareModal - Controls the visibility of the modal.
 * @param {function(boolean): void} props.setShowCompareModal - State setter function to update the modal's visibility.
 * @param {Array<Object>} props.selectedForCompare - Array of product objects selected for comparison.
 * @param {boolean} props.isComparingLoading - Indicates whether the AI trust scores are currently being fetched.
 * @param {Object.<string, string>} props.trustScores - A dictionary mapping store names to their AI trust scores (e.g., "High", "Low").
 * @returns {JSX.Element | null} The rendered portal containing the modal, or null if it shouldn't be shown.
 */
export default function CompareModal({
  showCompareModal,
  setShowCompareModal,
  selectedForCompare,
  isComparingLoading,
  trustScores
}: any) {
  if (!showCompareModal) return null;

  return createPortal(
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-950/60 backdrop-blur-lg" onClick={() => setShowCompareModal(false)}></div>
      <div className="relative z-10 w-full max-w-5xl glass-card rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl">
        
        {/* Centered Glow - Replicating logic that works */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none z-0" />

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
            {selectedForCompare.map((product: any, idx: number) => {
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
    </div>,
    document.body
  );
}