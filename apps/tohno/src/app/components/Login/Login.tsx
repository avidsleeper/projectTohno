export default function Login() {
  return (
    <div className="p-6 border rounded bg-white">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input type="text" placeholder="Username" className="border p-2 w-full mb-2" />
      <input type="password" placeholder="Password" className="border p-2 w-full mb-4" />
      <button className="bg-blue-600 text-white p-2 w-full">Sign In</button>
    </div>
  );
}
