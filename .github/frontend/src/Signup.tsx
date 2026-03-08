import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return; 
    }

    if (!agreed) return; 
    localStorage.setItem('hive_user_logged_in', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative font-sans text-gray-100 selection:bg-amber-500/30">
      <button onClick={() => navigate('/login')} className="absolute top-8 left-8 text-gray-500 hover:text-amber-500 transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="bg-gray-900 border-2 border-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden mt-10 mb-10">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white text-center mb-8 relative z-10">
          Create <span className="text-amber-500">Account.</span>
        </h2>

        <form onSubmit={handleSignUp} className="flex flex-col gap-5 relative z-10">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg" required />
          <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg" required />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors">
              {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
            </button>
          </div>

          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg" required />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center mt-1">{error}</p>}

          <div className="flex items-center gap-3 mt-2">
           <input 
              type="checkbox" 
              id="terms" 
              checked={agreed} 
              onChange={() => agreed ? setAgreed(false) : setShowModal(true)} 
              className="w-5 h-5 accent-amber-500 cursor-pointer" 
              required 
            />
            <label htmlFor="terms" className="text-gray-400 text-sm">
              I agree to the <span onClick={() => setShowModal(true)} className="text-amber-500 hover:text-amber-400 cursor-pointer font-bold underline">Terms and Agreements</span>
            </label>
          </div>

          <button type="submit" disabled={!agreed} className={`w-full font-bold py-4 rounded-2xl transition-all mt-2 text-lg shadow-lg ${agreed ? 'bg-amber-500 text-gray-950 hover:bg-amber-400 shadow-amber-500/20' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-8 relative z-10">
          <div className="flex-grow border-t-2 border-gray-800"></div>
          <span className="mx-4 text-gray-500 text-sm font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t-2 border-gray-800"></div>
        </div>

        <button onClick={() => navigate('/login')} className="w-full bg-transparent border-2 border-gray-800 text-gray-300 font-bold py-4 rounded-2xl hover:border-amber-500 hover:text-amber-500 transition-colors text-lg relative z-10">
          Log In
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 border-2 border-amber-500/50 p-8 rounded-3xl max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-amber-500 mb-4">Terms and Conditions of Use</h3>
            <div className="text-gray-300 mb-6 leading-relaxed space-y-4 text-sm">
              <p><strong>1. Academic Demonstration:</strong> This application is strictly an academic project prototype.</p>
              <p><strong>2. Data Storage & Privacy:</strong> Any information submitted through this form will be transmitted to and stored within our active backend databases. For your privacy and security, you are strictly advised <strong>not</strong> to use real names, genuine email addresses, active passwords, or any sensitive personal data.</p>
              <p><strong>3. Assumption of Risk:</strong> By proceeding, you acknowledge these risks. Any submission of genuine personal information is done entirely of your own volition. The developers assume no liability for any breach, loss, or unauthorized exposure of such data.</p>
            </div>
            <button 
              onClick={() => {
                setAgreed(true);
                setShowModal(false);
              }} 
              className="w-full bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-700 hover:text-amber-500 transition-colors text-sm"
            >
              I understand and have read the terms and agreements
            </button>
          </div>
        </div>
      )}
    </div>
  );
}