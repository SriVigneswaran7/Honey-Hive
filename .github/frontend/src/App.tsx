import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import './index.css';
import Results from './Results';
import Details from './Details';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
<<<<<<< HEAD
=======
        <Route path="/results" element={<Results />} />
        <Route path="/review" element={<Details />} />
>>>>>>> origin/feat/frontend
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;