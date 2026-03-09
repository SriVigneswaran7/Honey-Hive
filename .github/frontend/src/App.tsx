import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import './index.css';
import Results from './Results';
import Details from './Details';
import Signup from './Signup';
import History from './History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/results" element={<Results />} />
        <Route path="/review" element={<Details />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;