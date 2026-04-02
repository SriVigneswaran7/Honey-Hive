import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Sun, Moon, X } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 1. Grab the state to remember where they came from
  const returnState = location.state || {};
  const from = returnState.from || "/";

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const userStatus = localStorage.getItem('isLoggedIn');
    if (userStatus === 'true') {
      navigate('/', { replace: true });
    }
    setIsDark(document.documentElement.classList.contains('dark'));
  }, [navigate]);

  // Auto-clears error popup
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Frontend Validation (Don't bother the database if passwords don't match)
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return; 
    }
    if (!agreed) return; 

    try {
      // 2. Send the new user data to your Python backend (Updated to port 8000 and /auth/signup)
      const response = await fetch('http://127.0.0.1:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      // 3. Check if the backend successfully created the account
      if (response.ok && data.ok) {
        // Success! Log them in automatically
        localStorage.setItem('isLoggedIn', 'true');
        
        // Save the user's email and name for the UI
        localStorage.setItem('userEmail', email); 
        localStorage.setItem('userName', name); // <-- THIS IS THE MAGIC LINE

        navigate(from, { replace: true, state: returnState });
      } else {
        // 4. Trigger Toast if the DB rejects it (e.g., "Email already in use")
        setError(data.message || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      // 5. Fallback if the Python server is offline
      setError('Cannot connect to server. Please try again later.');
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div key="signup-page" className="animate-page min-h-screen flex flex-col text-gray-900 dark:text-gray-100 font-sans selection:bg-amber-500/30 relative overflow-hidden">
      
      {/* Glow Effect */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full relative z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/login', { state: returnState })} className="relative group p-2 transition-all active:scale-90">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 absolute inset-0 m-auto text-amber-500/60 blur-[3px] animate-pulse transform group-hover:-translate-x-1.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 relative z-10 transform group-hover:-translate-x-1.5 transition-all duration-300 text-gray-600 dark:text-gray-400 group-hover:text-amber-500 dark:group-hover:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          
          <div onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-amber-500 cursor-pointer hidden sm:block">
            Honey<span className="text-gray-900 dark:text-white transition-colors duration-500">Hive</span>
          </div>
        </div>

        <button onClick={toggleTheme} className="p-2.5 rounded-full glass-card hover:scale-110 active:scale-95 transition-all text-gray-600 dark:text-gray-300 hover:text-amber-500">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      {/* Maon Content Wrapper */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md relative group">
          <div className="absolute inset-0 scale-[1.05] bg-gradient-to-r from-amber-500/20 to-rose-500/20 rounded-[2.5rem] blur-2xl opacity-50 animate-pulse pointer-events-none"></div>
          
          <div className="relative glass-card rounded-[2.5rem] p-10 border border-gray-200 dark:border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
                Create <span className="text-amber-500">Account.</span>
              </h2>
            </div>

            {/* Form Logic */}
            <form onSubmit={handleSignUp} className="space-y-5">
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm" required />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm" required />
              
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm pr-12" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-500 transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 transition-all font-medium text-sm" required />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreed} 
                  onChange={() => agreed ? setAgreed(false) : setShowModal(true)} 
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-700 cursor-pointer" 
                  required 
                />
                <label htmlFor="terms" className="text-sm text-gray-500 dark:text-gray-400">
                  I agree to the <span onClick={() => setShowModal(true)} className="text-amber-500 hover:text-amber-400 cursor-pointer font-bold hover:underline transition-all">Terms and Agreements</span>
                </label>
              </div>

              <div className="relative group/btn pt-2">
                <div className={`absolute inset-0 bg-amber-500/40 rounded-full blur-xl transition-opacity duration-300 ${agreed ? 'opacity-0 group-hover/btn:opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                <button 
                  type="submit" 
                  disabled={!agreed} 
                  className={`relative w-full font-black py-4 rounded-full transition-all shadow-lg text-lg z-10 ${agreed ? 'bg-amber-500 text-gray-950 hover:bg-amber-400 active:scale-95' : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-300 dark:border-white/10'}`}
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
              <span className="mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-white/10"></div>
            </div>

            <button onClick={() => navigate('/login', { state: returnState })} className="w-full bg-white/5 dark:bg-transparent border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-full hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all text-lg active:scale-95">
              Log In
            </button>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-[100] p-4 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowModal(false)}>
          
          <div className="glass-card rounded-[2.5rem] border border-gray-200 dark:border-white/10 p-10 max-w-lg w-full shadow-2xl relative overflow-hidden group animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            
            {/* Glow Effect */}
            <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <h3 className="text-3xl font-black text-amber-500 mb-6 tracking-tight relative z-10">Terms and Conditions of Use</h3>
            
            <div className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed space-y-4 text-sm font-medium relative z-10 h-80 overflow-y-auto pr-4 selection:bg-amber-500/20">
              <p><strong className="text-gray-900 dark:text-white font-bold">1. Academic Demonstration:</strong> This application is strictly an academic project prototype for demonstration purposes only.</p>
              <p><strong className="text-gray-900 dark:text-white font-bold">2. Data Storage & Privacy:</strong> Any information submitted through this form will be transmitted to and stored within our active backend databases. For your privacy and security, you are <span className="text-amber-500 font-bold">strictly advised not</span> to use real names, genuine email addresses, active passwords, or any sensitive personal data.</p>
              <p><strong className="text-gray-900 dark:text-white font-bold">3. Assumption of Risk:</strong> By proceeding, you acknowledge these risks. Any submission of genuine personal information is done entirely of your own volition. The developers assume no liability for any breach, loss, or unauthorized exposure of such data.</p>
              <div className="h-4"></div>
            </div>

            <button 
              onClick={() => {
                setAgreed(true);
                setShowModal(false);
              }} 
              className="relative w-full bg-white/5 dark:bg-transparent border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-full hover:border-amber-500 hover:text-amber-500 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all text-lg active:scale-95 z-10"
            >
              I understand and have read the terms
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {error && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="relative glass-card border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)] rounded-2xl px-6 py-4 flex items-center gap-4 overflow-hidden bg-gray-900/90 backdrop-blur-xl">
            {/* Red Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            
            <p className="font-bold text-red-500 text-sm relative z-10">{error}</p>
            
            <button 
              onClick={() => setError('')} 
              className="text-red-500/70 hover:text-red-500 transition-colors relative z-10"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}