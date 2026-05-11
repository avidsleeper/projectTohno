import { useState } from 'react';
import { useGetEssays, useGetEssaysRandom } from "../../api/generated/default/default";

export default function Home() {
  const [search, setSearch] = useState('');

  // API: fetch essays with optional search query
  const { data: essaysData, isLoading } = useGetEssays({ q: search });
  const essays = essaysData?.essays || essaysData || [];

  // API: fetch a random essay/video ID to redirect
  const randomMutation = useGetEssaysRandom();

  const handleRandom = () => {
    randomMutation.mutate(undefined, {
      onSuccess: (data: any) => {
        const id = data?.id || data?.data?.id;
        if (id) window.location.href = `/post/${id}`;
      },
      onError: () => {
        alert('Could not fetch a random post. Try again!');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Welcome to EssayShare</h1>
        <p className="text-blue-100 text-lg mb-8">Discover essays and videos from students and teachers.</p>

        <button
          onClick={handleRandom}
          disabled={randomMutation.isPending}
          className="bg-white text-blue-700 font-bold px-6 py-3 rounded-full shadow-md hover:bg-blue-50 transition-all disabled:opacity-50"
        >
          {randomMutation.isPending ? 'Finding...' : '🎲 Take Me Somewhere Random'}
        </button>
      </div>

      {/* Search + List */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <input
          type="text"
          placeholder="Search essays or videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 mb-8 bg-white"
        />

        {isLoading ? (
          <p className="text-center text-gray-400 py-10">Loading posts...</p>
        ) : essays.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {essays.map((essay: any) => (
              <div
                key={essay.id}
                onClick={() => window.location.href = `/post/${essay.id}`}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-base">{essay.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${essay.type === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {essay.type === 'video' ? '🎬 Video' : '📝 Essay'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{essay.author} · {new Date(essay.createdAt).toLocaleDateString()}</p>
                {essay.excerpt && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{essay.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
