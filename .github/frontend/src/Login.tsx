import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleFakeLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/'); // Sends them back to Home
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Login Page Placeholder</h2>
        <button onClick={handleFakeLogin} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Log In (Simulate)
        </button>
      </div>
    </div>
  );
}