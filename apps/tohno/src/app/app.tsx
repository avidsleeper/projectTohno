import { Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Post from './components/Post/Post';
import Upload from './components/Upload/Upload';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-4 bg-white shadow flex gap-4 font-bold">
        <Link to="/" className="text-blue-600">Home</Link>
        <Link to="/login" className="text-blue-600">Login</Link>
        <Link to="/register" className="text-blue-600">Register</Link>
        <Link to="/upload" className="text-blue-600">Upload</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </div>
  );
}

export default App;
