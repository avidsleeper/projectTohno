import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white shadow flex gap-4 font-bold">
        <Link to="/" className="text-blue-600">Home</Link>
        <Link to="/login" className="text-blue-600">Login</Link>
        <Link to="/register" className="text-blue-600">Register</Link>
      </nav>
      <div className="p-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
