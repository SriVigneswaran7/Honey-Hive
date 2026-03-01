import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/'); 
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Added position: 'relative' and zIndex: 10 to break through the form's invisible shield */}
      <div 
        onClick={() => navigate('/')}
        style={{ padding: '30px', fontSize: '32px', color: '#E5C158', cursor: 'pointer', width: 'fit-content', position: 'relative', zIndex: 10 }}
      >
        ←
      </div>

      {/* Added zIndex: 1 here just to keep the layering clean */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '-100px', position: 'relative', zIndex: 1 }}>
        <form onSubmit={handleLogin} style={{ 
          width: '100%', maxWidth: '400px', padding: '40px', backgroundColor: '#1a1a1a', 
          borderRadius: '20px', border: '1px solid #333', textAlign: 'center' 
        }}>
          <h2 style={{ color: '#E5C158', fontSize: '28px', marginBottom: '30px' }}>Join the Hive</h2>
          <input 
            type="email" placeholder="Email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: '#fff', outline: 'none' }} 
          />
          <input 
            type="password" placeholder="Password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '14px', marginBottom: '25px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#0a0a0a', color: '#fff', outline: 'none' }} 
          />
          <button type="submit" style={{ 
            width: '100%', padding: '14px', backgroundColor: '#E5C158', color: '#000', 
            border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}