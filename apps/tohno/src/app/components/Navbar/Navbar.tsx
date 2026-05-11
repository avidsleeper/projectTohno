import { Link } from 'react-router-dom';

interface NavbarProps {
  showNav?: boolean;
}

export default function Navbar({ showNav = true }: NavbarProps) {
  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    alert('Logged out successfully!');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
            Tohno
          </Link>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-700 font-medium hover:text-blue-600 transition">
              Home
            </Link>
            <Link to="/upload" className="text-gray-700 font-medium hover:text-blue-600 transition">
              Upload
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/account-settings" className="text-gray-700 font-medium hover:text-blue-600 transition">
            ⚙️ Settings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
