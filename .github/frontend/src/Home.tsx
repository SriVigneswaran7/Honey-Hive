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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Top Right Auth Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '150px' }}>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={{ padding: '10px 20px', cursor: 'pointer' }}>Logout</button>
        ) : (
          <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Login</button>
        )}
      </div>

      {/* Center Search Area (Fixed 600px) */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', width: '600px' }}>
          <input
            type="text"
            placeholder="Paste retail link or search product..."
            style={{ flex: 1, padding: '15px', fontSize: '16px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSearch} style={{ padding: '15px 25px', cursor: 'pointer', border: '1px solid #ccc', borderLeft: 'none' }}>
            🔍
          </button>
        </div>
      </div>

    </div>
  );
}