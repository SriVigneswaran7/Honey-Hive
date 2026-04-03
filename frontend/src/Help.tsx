import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, Swords, Tag, ShieldCheck, 
  Lightbulb, Sun, Moon, Zap, Lock, ArrowLeft, Activity
} from 'lucide-react';

export default function Help() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const sections = [
    {
      id: "hunt",
      icon: <Search className="text-amber-500" size={24} />,
      title: "Smart Discovery",
      subtitle: "Instant Market Sync",
      desc: "Paste direct links or search by name. We scan the UK's top retailers in real-time to bring every deal into one unified view.",
      grid: "md:col-span-7",
      tip: "Optimised for Amazon, Currys, Argos and more."
    },
    {
      id: "vault",
      icon: <Lock className="text-rose-500" size={20} />,
      title: "Personal Vault",
      subtitle: "Cloud Sync",
      desc: "Sign in to unlock your search history. Your tracked deals and past hunts are saved securely across all your devices.",
      grid: "md:col-span-5",
      tip: "Your search history is private and secure."
    },
    {
      id: "brain",
      icon: <Sparkles className="text-amber-500" size={20} />,
      title: "AI Verdicts",
      subtitle: "Hardware Intelligence",
      desc: "Our AI cuts through marketing fluff to provide professional technical verdicts, highlighting real-world pros and cons.",
      grid: "md:col-span-4",
      tip: "Get a pro hardware analyst's view instantly."
    },
    {
      id: "interceptor",
      icon: <Zap className="text-amber-400" size={20} />,
      title: "Strict Budgeting",
      subtitle: "Price Shield",
      desc: "Set your limit and we'll enforce it. Our engine ensures you never see a deal that's a single penny over your budget.",
      grid: "md:col-span-4",
      tip: "Absolute budget compliance, guaranteed."
    },
    {
      id: "trust",
      icon: <ShieldCheck className="text-blue-500" size={20} />,
      title: "Vetted Stores",
      subtitle: "UK Security Check",
      desc: "We verify every retailer for reliability and security, so you can shop third-party sellers with total peace of mind.",
      grid: "md:col-span-4",
      tip: "Only shop with trusted UK retailers."
    },
    {
      id: "battle",
      icon: <Swords className="text-amber-500" size={24} />,
      title: "Battle Mode",
      subtitle: "Side-by-Side Comparison",
      desc: "Hit the '+' button to pit products against each other in a high-stakes matrix to find the absolute best value.",
      grid: "md:col-span-5",
      tip: "The fastest way to compare tech specs."
    },
    {
      id: "sting",
      icon: <Tag className="text-emerald-500" size={24} />,
      title: "Live Coupons",
      subtitle: "Automated Savings",
      desc: "Our engine hunts for active discount codes while you shop, ranking them by their probability of success.",
      grid: "md:col-span-7",
      tip: "Check 'Best Bet' codes for instant checkout savings."
    }
  ];

  return (
    <div className="animate-page min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 pb-12">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto relative z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)} 
            className="relative group p-2 transition-all active:scale-90"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <ArrowLeft className="h-7 w-7 absolute inset-0 m-auto text-amber-500/60 blur-[3px] animate-pulse -translate-x-1" />
            </div>
            <ArrowLeft className="h-7 w-7 relative z-10 transform group-hover:-translate-x-1.5 transition-all duration-300 text-gray-600 dark:text-gray-400 group-hover:text-amber-500" />
          </button>

          <div 
            onClick={() => navigate('/')} 
            className="text-2xl font-black tracking-tighter text-amber-500 cursor-pointer"
          >
            Honey<span className="text-gray-900 dark:text-white transition-colors duration-500">Hive</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Playbook Label */}
          <span className="text-[10px] font-light tracking-[0.4em] uppercase text-gray-400 dark:text-gray-500 hidden sm:block">
            Playbook
          </span>

          <button onClick={toggleTheme} className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-4 relative z-10">
        <header className="mb-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white mb-2 leading-none">
            Master the <span className="text-amber-500">Hunt.</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl leading-snug">
            Unlocking the full potential of your AI-assisted shopping experience.
          </p>
        </header>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min">
          {sections.map((item) => (
            <div 
              key={item.id} 
              className={`group relative glass-card rounded-[1.75rem] p-6 border border-gray-200 dark:border-white/10 transition-all duration-300 hover:border-amber-500/40 hover:shadow-[0_15px_30px_-15px_rgba(245,158,11,0.15)] flex flex-col ${item.grid}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <Activity size={14} className="text-amber-500/20 group-hover:text-amber-500 transition-colors" />
              </div>

              <div className="mb-2">
                <h3 className="text-md font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{item.title}</h3>
                <p className="text-amber-500 font-black uppercase text-[8px] tracking-[0.15em]">{item.subtitle}</p>
              </div>

              <p className="text-gray-500 dark:text-gray-400 font-medium text-[11px] leading-relaxed mb-4">
                {item.desc}
              </p>

              <div className="mt-auto pt-3 border-t border-gray-200/50 dark:border-white/5 flex items-center gap-2">
                <Lightbulb size={12} className="text-amber-500" />
                <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                  {item.tip}
                </p>
              </div>
            </div>
          ))}

          {/* Footer */}
          <div className="md:col-span-12 glass-card p-6 rounded-[2.2rem] flex items-center justify-between gap-4 border border-amber-500/20 bg-amber-500/5 mt-2 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                  <Activity size={24} className="text-gray-950 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight text-gray-900 dark:text-white leading-none mb-1">Ready to hunt?</h4>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">The engine is primed and synced for UK retailers.</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="bg-gray-950 dark:bg-amber-500 text-white dark:text-gray-950 px-10 py-3.5 rounded-full font-black hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-[0.2em] shadow-xl relative z-10"
              >
                Launch Engine
              </button>
          </div>
        </div>
      </main>
    </div>
  );
}