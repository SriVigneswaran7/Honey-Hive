import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Tell the browser to remember the user!
    localStorage.setItem('isLoggedIn', 'true');
    
    // 2. Send them back to the Home screen
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center relative font-sans text-gray-100 selection:bg-amber-500/30">
      
      {/* Back Arrow - Top Left */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-gray-500 hover:text-amber-500 transition-colors p-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Login Card */}
      <div className="bg-gray-900 border-2 border-gray-800 p-10 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-4xl font-extrabold tracking-tight text-white text-center mb-8 relative z-10">
          Join the <span className="text-amber-500">Hive.</span>
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5 relative z-10">
          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-950 border-2 border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all text-lg"
            required
          />

          <button 
            type="submit"
            className="w-full bg-amber-500 text-gray-950 font-bold py-4 rounded-2xl hover:bg-amber-400 transition-colors mt-2 text-lg shadow-lg shadow-amber-500/20"
          >
            Sign In
          </button>
        </form>

        {/* The "OR" Divider */}
        <div className="flex items-center my-8 relative z-10">
          <div className="flex-grow border-t-2 border-gray-800"></div>
          <span className="mx-4 text-gray-500 text-sm font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t-2 border-gray-800"></div>
        </div>

        {/* The Handoff Button */}
        <button 
          onClick={() => navigate('/signup')}
          className="w-full bg-transparent border-2 border-gray-800 text-gray-300 font-bold py-4 rounded-2xl hover:border-amber-500 hover:text-amber-500 transition-colors text-lg relative z-10"
        >
          Create Account
        </button>

      </div>
    </div>
  );
}