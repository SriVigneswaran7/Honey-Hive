import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Checks local storage when the page loads
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleSearch = () => {
    console.log("Future backend hook: Searching for product...");
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0a0a0a', // Deep black background
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Top Right Auth Button */}
      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'flex-end' }}>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout} 
            style={{ padding: '10px 24px', backgroundColor: 'transparent', color: '#E5C158', border: '1px solid #E5C158', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => navigate('/login')} 
            style={{ padding: '10px 24px', backgroundColor: '#E5C158', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Login
          </button>
        )}
      </div>

      {/* Center Search Area (Fixed 600px) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '-100px' }}>
        
        {/* Project Title */}
        <h1 style={{ fontSize: '3.5rem', marginBottom: '40px', color: '#E5C158', letterSpacing: '2px', fontWeight: '800' }}>
          HONEY-HIVE
        </h1>

        <div style={{ display: 'flex', width: '600px', boxShadow: '0 4px 20px rgba(229, 193, 88, 0.05)', borderRadius: '30px' }}>
          <input
            type="text"
            placeholder="Paste retail link or search product..."
            style={{ 
              flex: 1, 
              padding: '18px 25px', 
              fontSize: '16px', 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333', 
              borderRight: 'none',
              borderRadius: '30px 0 0 30px',
              color: '#fff',
              outline: 'none'
            }}
          />
          <button 
            onClick={handleSearch} 
            style={{ 
              padding: '0 30px', 
              backgroundColor: '#E5C158', 
              border: 'none', 
              borderRadius: '0 30px 30px 0', 
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            🔍
          </button>
        </div>
      </div>

    </div>
  );
}