import { useState, useRef } from 'react';
import { usePostEssays } from "../../api/generated/default/default";

type UploadType = 'essay' | 'video';

export default function Upload() {
  const [uploadType, setUploadType] = useState<UploadType>('essay');
  const [title, setTitle] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = usePostEssays();

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (uploadType === 'essay' && !essayContent.trim()) {
      alert("Please enter your essay content.");
      return;
    }

    if (uploadType === 'video' && !videoFile) {
      alert("Please select a video file.");
      return;
    }

    // Build FormData for file upload support
    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', uploadType);

    if (uploadType === 'essay') {
      formData.append('content', essayContent);
    } else if (videoFile) {
      formData.append('video', videoFile);
    }

    uploadMutation.mutate({
      data: formData as any
    }, {
      onSuccess: (data: any) => {
        const id = data?.id || data?.data?.id;
        alert('Upload successful!');
        window.location.href = id ? `/post/${id}` : '/';
      },
      onError: (error: any) => {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    } else {
      alert('Please drop a valid video file.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Upload Content</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Share your essay or video with the community.</p>

        {/* Type Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          <button
            onClick={() => setUploadType('essay')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${uploadType === 'essay' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            📝 Essay
          </button>
          <button
            onClick={() => setUploadType('video')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${uploadType === 'video' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            🎬 Video
          </button>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              placeholder="Enter a title for your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Essay Content */}
          {uploadType === 'essay' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Essay Content</label>
              <textarea
                placeholder="Write or paste your essay here..."
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                rows={12}
                className="border p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-y text-sm"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">{essayContent.length} characters</p>
            </div>
          )}

          {/* Video Upload */}
          {uploadType === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Video File</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'}`}
              >
                {videoFile ? (
                  <div>
                    <p className="text-purple-700 font-medium">✅ {videoFile.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(videoFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 text-sm">Drag & drop a video file here, or <span className="text-purple-600 font-medium">browse</span></p>
                    <p className="text-xs text-gray-400 mt-1">MP4, MOV, WebM supported</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setVideoFile(file);
                }}
              />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={uploadMutation.isPending}
            className={`w-full text-white p-3 rounded-lg font-bold transition-colors disabled:bg-gray-400 ${uploadType === 'essay' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {uploadMutation.isPending ? 'Uploading...' : `Publish ${uploadType === 'essay' ? 'Essay' : 'Video'}`}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          <span className="text-blue-600 cursor-pointer font-medium hover:underline" onClick={() => window.location.href = '/'}>
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
  );
}
