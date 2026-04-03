import React from 'react';
import { createPortal } from 'react-dom';
import { X, HelpCircle, Search, Sparkles, Swords, Tag, ShieldCheck } from 'lucide-react';

export default function Help({ onClose }: { onClose: () => void }) {
  const pillars = [
    {
      icon: <Search className="text-amber-500" size={22} />,
      title: "Smart Search",
      desc: "Search by product name or paste direct store links from Amazon, Currys, Argos and more. Our engine scans the UK market to normalise live prices."
    },
    {
      icon: <Sparkles className="text-amber-500" size={22} />,
      title: "AI Hardware Verdict",
      desc: "Click 'AI Review' to see a technical analyst verdict. We synthesise deep market data into specific pros, cons and hardware specifications."
    },
    {
      icon: <Swords className="text-amber-500" size={22} />,
      title: "Battle Mode",
      desc: "Found two great deals? Hit the '+' button on the product cards to queue them up for a high-stakes side-by-side comparison."
    },
    {
      icon: <Tag className="text-amber-500" size={22} />,
      title: "Live Coupon Scraper",
      desc: "Our engine hunts the live web for active promotional codes and uses AI to rank which ones are most likely to work at checkout."
    }
  ];

  return createPortal(
    /* Layout alignment matching Filters.tsx */
    <div className="fixed inset-0 z-[300] flex items-start justify-center pt-24 sm:pt-32 pb-4 px-4 sm:px-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-950/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-[3rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl">
        
        {/* Centered Glow - Replicating Coupons.tsx logic */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 rounded-full blur-[80px] pointer-events-none z-0" />

        {/* Header - Styled like Filters.tsx */}
        <div className="relative z-10 p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-white/30 dark:bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
              <HelpCircle size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">How to use HoneyHive</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:text-amber-500 hover:bg-amber-500/10 transition-all active:scale-90">
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Body - Styled like Filters.tsx */}
        <div className="relative z-10 p-8 space-y-8 overflow-y-auto max-h-[60vh] selection:bg-amber-500/30">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pillars.map((item, i) => (
              <div key={i} className="bg-white/30 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-5 rounded-[2rem] hover:border-amber-500/30 transition-all group/item backdrop-blur-md">
                <div className="mb-3 p-2 bg-amber-500/10 w-fit rounded-xl group-hover/item:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Reliability Note */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="text-amber-500 p-2 bg-amber-500/10 rounded-xl">
              <ShieldCheck size={18} />
            </div>
            <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest leading-tight">
              HoneyHive performs real-time security scans on all third-party vendors to ensure UK reliability.
            </p>
          </div>
        </div>

        {/* Footer - Styled like Filters.tsx */}
        <div className="relative z-10 p-6 bg-white/30 dark:bg-white/5 border-t border-gray-200 dark:border-white/10 backdrop-blur-md">
          <button 
            onClick={onClose} 
            className="w-full bg-amber-500 text-gray-950 font-black py-4 rounded-full hover:bg-amber-400 transition-all shadow-lg active:scale-95 text-lg"
          >
            Got it, let's hunt!
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}