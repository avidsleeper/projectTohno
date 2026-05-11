import { useState, useRef, useEffect } from 'react';
import { usePostDocuments, useGetDocumentsStripJobId } from "../../api/generated/documents/documents";
import Navbar from '../Navbar/Navbar';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = usePostDocuments();

  const { data: jobData } = useGetDocumentsStripJobId(jobId ?? '', {
    query: {
      enabled: !!jobId,
      refetchInterval: 2000,
    },
  });

  useEffect(() => {
    const status = (jobData as any)?.status;
    if (status === 'done') {
      const docId = (jobData as any)?.documentId;
      window.location.href = docId ? `/post/${docId}` : '/';
    } else if (status === 'failed') {
      alert('Document processing failed. Please try uploading again.');
      setJobId(null);
    }
  }, [jobData]);

  const handleSubmit = () => {
    if (!file) { alert('Please select a DOCX file.'); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      uploadMutation.mutate({ data: { filename: file.name, data: base64 } }, {
        onSuccess: (response: any) => {
          const id = response?.jobId;
          if (id) {
            setJobId(id);
          } else {
            window.location.href = '/';
          }
        },
        onError: (error: any) => {
          console.error('Upload error:', error);
          alert('Upload failed. Please try again.');
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.docx') || f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(f);
    } else {
      alert('Please drop a valid DOCX file.');
    }
  };

  if (jobId) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4 animate-pulse">⏳</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Processing your document</h2>
            <p className="text-sm text-gray-500">Stripping metadata… this usually takes a few seconds.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Upload Document</h2>
        <p className="text-sm text-gray-500 text-center mb-8">
          Share your DOCX document with the community. Metadata will be stripped automatically.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors mb-6 ${
            dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }`}
        >
          {file ? (
            <div>
              <p className="text-blue-700 font-medium">✅ {file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 text-sm">
                Drag & drop a DOCX file here, or{' '}
                <span className="text-blue-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">DOCX files only</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={uploadMutation.isPending || !file}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={() => window.location.href = '/'}
          >
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
    </>
  );
}
