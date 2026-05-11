import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';

export default function AccountSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    // Fetch user data from API
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1] || ''}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setTwoFAEnabled(data.twoFAEnabled || false);
        } else {
          alert('Failed to load account details');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Fetch user error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEnable2FA = () => {
    window.location.href = '/2fa';
  };

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable 2FA? This will make your account less secure.')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/2fa/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${document.cookie.match(/(?:^|;\s*)token=([^;]+)/)?.[1] || ''}`
        }
      });

      if (response.ok) {
        setTwoFAEnabled(false);
        alert('2FA disabled successfully');
      } else {
        alert('Failed to disable 2FA');
      }
    } catch (error) {
      console.error('Disable 2FA error:', error);
      alert('Error disabling 2FA');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <p className="text-gray-500">Loading account settings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

            {/* Account Information */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <input
                    type="text"
                    value={user?.teacher ? 'Teacher' : 'Student'}
                    disabled
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-medium text-gray-800">Two-Factor Authentication (2FA)</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {twoFAEnabled
                        ? 'Your account is protected with 2FA'
                        : 'Add an extra layer of security to your account'}
                    </p>
                  </div>
                  {twoFAEnabled ? (
                    <>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mr-3">
                        ✓ Enabled
                      </span>
                      <button
                        onClick={handleDisable2FA}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                      >
                        Disable
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mr-3">
                        Disabled
                      </span>
                      <button
                        onClick={handleEnable2FA}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Enable
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h2>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-800">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1 mb-4">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
                <button
                  onClick={() => alert('Account deletion feature coming soon')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
