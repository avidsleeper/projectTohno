import { useState } from 'react';
import { useGet, usePostSearch, getRandom } from "../../api/generated/documents/documents";
import type { Get200Item, PostSearch200ResultsItem } from "../../api/generated/model";
import Navbar from '../Navbar/Navbar';

export default function Home() {
  const [search, setSearch] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);

  const { data: allDocs, isLoading } = useGet();
  const searchMutation = usePostSearch();

  const handleSearchChange = (q: string) => {
    setSearch(q);
    if (q.trim()) {
      searchMutation.mutate({ data: { query: q } });
    }
  };

  const handleRandom = async () => {
    setIsNavigating(true);
    try {
      const result = await getRandom() as any;
      const docId = result?.documentId;
      if (docId) {
        window.location.href = `/post/${docId}`;
      } else {
        alert('No documents found.');
      }
    } catch {
      alert('Could not fetch a random document. Try again!');
    } finally {
      setIsNavigating(false);
    }
  };

  const searching = search.trim().length > 0;
  const searchResults: PostSearch200ResultsItem[] = (searchMutation.data as any)?.results || [];
  const docs: Get200Item[] = (allDocs as any) || [];
  const loading = searching ? searchMutation.isPending : isLoading;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Welcome to DocShare</h1>
        <p className="text-blue-100 text-lg mb-8">Discover documents from students and teachers.</p>

        <button
          onClick={handleRandom}
          disabled={isNavigating}
          className="bg-white text-blue-700 font-bold px-6 py-3 rounded-full shadow-md hover:bg-blue-50 transition-all disabled:opacity-50"
        >
          {isNavigating ? 'Finding...' : '🎲 Take Me Somewhere Random'}
        </button>
      </div>

      {/* Search + List */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500 mb-8 bg-white"
        />

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading documents...</p>
        ) : searching ? (
          searchResults.length === 0 ? (
            <p className="text-center text-gray-400 py-10">No results found.</p>
          ) : (
            <div className="space-y-4">
              {searchResults.map((doc) => (
                <div
                  key={doc.documentId}
                  onClick={() => window.location.href = `/post/${doc.documentId}`}
                  className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 text-base">{doc.filename}</h3>
                    {doc.similarity !== undefined && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                        {Math.round(doc.similarity * 100)}% match
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : docs.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No documents found.</p>
        ) : (
          <div className="space-y-4">
            {docs.map((doc) => (
              <div
                key={doc.documentId}
                onClick={() => window.location.href = `/post/${doc.documentId}`}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800 text-base">{doc.filename}</h3>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    📄 Document
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Uploaded {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
