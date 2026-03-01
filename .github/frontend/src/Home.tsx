import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.clear();
      setIsLoggedIn(false);
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' }}>
      
      {/* Added position: 'relative' and zIndex: 10 to break through the invisible shield */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 10 }}>
        <button 
          onClick={handleAuth}
          style={{ 
            padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
            backgroundColor: isLoggedIn ? 'transparent' : '#E5C158',
            color: isLoggedIn ? '#E5C158' : '#000',
            border: isLoggedIn ? '1px solid #E5C158' : 'none'
          }}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-80px', position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontSize: '4rem', color: '#E5C158', fontWeight: '900', marginBottom: '40px' }}>HONEY-HIVE</h1>
        <div style={{ display: 'flex', width: '100%', maxWidth: '600px', borderRadius: '40px', overflow: 'hidden', border: '1px solid #333' }}>
          <input type="text" placeholder="Search products..." style={{ flex: 1, padding: '20px 30px', backgroundColor: '#111', color: '#fff', border: 'none', outline: 'none' }} />
          <button style={{ padding: '0 35px', backgroundColor: '#E5C158', border: 'none', cursor: 'pointer' }}>🔍</button>
        </div>
      </div>
    </div>
  );
}