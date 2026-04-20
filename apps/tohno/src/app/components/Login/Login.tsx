import { useState } from 'react';
import { usePostUsersLogin } from "../../api/generated/default/default"; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const loginMutation = usePostUsersLogin();

  const handleLogin = () => {
    if (!email.includes('@')) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    console.log("LOGIC CHECK - Sending to API:", { email, password });

    loginMutation.mutate({
      data: { email, password }
    }, {
      onSuccess: (response: any) => {
        const token = response.token || response.data?.token; 
        
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;
          alert('Logged in successfully!');
          window.location.href = '/'; 
        }
      },
      onError: (error) => {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign In</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input 
            type="email" 
            placeholder="name@email.com" 
            className="mt-1 border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="mt-1 border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button 
          onClick={handleLogin}
          disabled={loginMutation.isPending}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors mt-2"
        >
          {loginMutation.isPending ? 'Authenticating...' : 'Login'}
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account? <span className="text-blue-600 cursor-pointer font-medium hover:underline" onClick={() => window.location.href = '/register'}>Sign up</span>
      </p>
    </div>
  );
}