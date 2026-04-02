import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Tag, Copy } from 'lucide-react';

// Coupon Modal Component
const CouponModal = ({ product, onClose }: any) => {
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCodes = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: product.link, store: product.store, title: product.title }),
        });
        const data = await res.json();
        if (data.error && data.codes?.length === 0) {
          setError(data.error);
        } else {
          setCodes(data.codes || []);
        }
      } catch (e) {
        setError('Failed to fetch codes. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchCodes();
  }, [product.link, product.store, product.title]);

  const handleCopy = (code: any) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const confidenceConfig: any = {
    high:   { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20', dot: 'bg-emerald-500', label: 'Best Bet' },
    medium: { color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',     dot: 'bg-amber-500',   label: 'Worth Trying' },
    low:    { color: 'text-gray-500 dark:text-gray-400',       bg: 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10',                dot: 'bg-gray-400',    label: 'Unlikely' },
  };

  // This "teleports" the modal to the very top of the HTML body, bypassing all scroll/animation traps
  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg glass-card rounded-[2.5rem] border border-white/60 dark:border-white/10 shadow-2xl overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-7 pb-5 flex items-start justify-between border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <img src={product.thumbnail} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
            </div>
            <div>
              <h2 className="font-black text-lg text-gray-900 dark:text-white leading-tight line-clamp-1">
                Discount Codes
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1 mt-0.5">
                {product.title}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-500/10 transition-all active:scale-90">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="p-7 pt-5 max-h-[60vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                <Tag size={18} className="absolute inset-0 m-auto text-amber-500" />
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-sm">Hunting for codes...</p>
                <p className="text-xs text-gray-400 mt-1">Scanning coupon sites & AI-ranking results</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <X size={24} className="text-red-400" />
              </div>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{error}</p>
            </div>
          ) : codes.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🍯</div>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No codes found right now</p>
              <p className="text-xs text-gray-400 mt-1">This store may not have active public codes</p>
            </div>
          ) : (
            <>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                {codes.length} code{codes.length !== 1 ? 's' : ''} found · AI-ranked for this product
              </p>
              {codes.map((item, i) => {
                const conf = confidenceConfig[item.confidence] || confidenceConfig.low;
                const isCopied = copied === item.code;
                return (
                  <div key={i} className={`group relative rounded-2xl border p-4 transition-all duration-200 ${conf.bg} hover:scale-[1.01]`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${conf.dot}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-gray-900 dark:text-white text-base tracking-wide">
                              {item.code}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${conf.bg} ${conf.color}`}>
                              {conf.label}
                            </span>
                          </div>
                          {item.reason && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleCopy(item.code)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs transition-all active:scale-90
                          ${isCopied
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 dark:hover:text-white hover:shadow-lg hover:shadow-amber-500/20'
                          }`}
                      >
                        {isCopied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && codes.length > 0 && (
          <div className="px-7 pb-6 pt-2">
            <p className="text-[10px] text-gray-400 text-center">
              Copy a code and paste it at checkout · Codes ranked by AI for this specific product
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default CouponModal;