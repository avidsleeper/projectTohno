import { useState } from 'react';

export default function AccountRecovery() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your inbox</h2>
            <p className="text-gray-500 text-sm mb-6">
              If an account exists for <span className="font-medium text-gray-700">{email}</span>, you'll receive a password reset link shortly.
            </p>
            <span
              className="text-blue-600 cursor-pointer text-sm font-medium hover:underline"
              onClick={() => window.location.href = '/login'}
            >
              ← Back to Login
            </span>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Recover Account</h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send Recovery Email
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500">
              Remembered your password?{' '}
              <span
                className="text-blue-600 cursor-pointer font-medium hover:underline"
                onClick={() => window.location.href = '/login'}
              >
                Sign in
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
