import { Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Post from './components/Post/Post';
import Upload from './components/Upload/Upload';
import TwoFA from './components/TwoFA/TwoFA';
import AccountSettings from './components/AccountSettings/AccountSettings';

export function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/2fa" element={<TwoFA />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Routes>
    </div>
  );
}

export default App;
