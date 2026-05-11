import { useState } from 'react';
import { usePostUsers } from "../../api/generated/default/default";

// Menu bar removed — this page renders standalone with no nav.

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [teacher, setTeacher] = useState(false);

  const registerMutation = usePostUsers();

  const handleRegister = () => {
    if (!email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }
    if (!name.trim()) {
      alert("Please enter your username.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    registerMutation.mutate({
      data: { email, password, name, teacher }
    }, {
      onSuccess: () => {
        alert('Account created successfully! Redirecting to login...');
        window.location.href = '/login';
      },
      onError: (error: any) => {
        console.error('Registration error:', error);
        alert('Failed to create account. This email might already be registered.');
      }
    });
  };

  return (
    // Full-page layout — no wrapping nav/menu bar
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="p-8 w-full max-w-md border rounded-xl bg-white shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="name@email.com"
              className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="mt-1 border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="teacher"
              className="w-4 h-4 rounded"
              onChange={(e) => setTeacher(e.target.checked)}
            />
            <label htmlFor="teacher" className="ml-2 text-sm font-medium text-gray-700">I am a teacher</label>
          </div>

          <button
            onClick={handleRegister}
            disabled={registerMutation.isPending}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:bg-gray-400 transition-colors mt-2"
          >
            {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => window.location.href = '/login'}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
