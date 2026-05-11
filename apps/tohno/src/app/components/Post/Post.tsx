import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetDocumentsDocumentId } from "../../api/generated/documents/documents";
import { useGetCommentsDocumentId, usePostComments, useDeleteCommentsCommentId } from "../../api/generated/comments/comments";

export default function Post() {
  const { postId = '' } = useParams<{ postId: string }>();
  const [commentText, setCommentText] = useState('');

  const { data: postData, isLoading: postLoading } = useGetDocumentsDocumentId(postId);
  const post = postData as any;

  const { data: commentsData, isLoading: commentsLoading, refetch: refetchComments } = useGetCommentsDocumentId(postId);
  const comments: any[] = (commentsData as any) || [];

  const commentMutation = usePostComments();
  const deleteMutation = useDeleteCommentsCommentId();

  const handleDeleteComment = (commentId: string) => {
    deleteMutation.mutate({ commentId }, {
      onSuccess: () => refetchComments(),
      onError: (error: any) => {
        const status = error?.response?.status;
        if (status === 403) {
          alert('You can only delete comments on your own documents.');
        } else {
          alert('Failed to delete comment.');
        }
      },
    });
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate({
      data: { documentId: postId, text: commentText }
    }, {
      onSuccess: () => {
        setCommentText('');
        refetchComments();
      },
      onError: (error: any) => {
        console.error('Comment error:', error);
        alert('Failed to post comment. Are you logged in?');
      }
    });
  };

  const handleDownload = async () => {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/documents/${postId}/download`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) { alert('Download failed.'); return; }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = post?.filename || 'document.docx';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading document...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Document not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <span
          className="text-blue-600 cursor-pointer text-sm font-medium hover:underline"
          onClick={() => window.location.href = '/'}
        >
          ← Back to Home
        </span>
        <span className="text-xs px-2 py-1 rounded-full font-medium ml-auto bg-green-100 text-green-700">
          📄 Document
        </span>
      </div>

      {/* Main layout: content left, comments right */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-6 h-[calc(100vh-65px)]">

        {/* Left: Document Info */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.filename}</h1>
          <p className="text-sm text-gray-500 mb-6">
            Uploaded {post.uploadedAt ? new Date(post.uploadedAt).toLocaleDateString() : '—'}
            {post.processedAt && ` · Processed ${new Date(post.processedAt).toLocaleDateString()}`}
          </p>
          <button
            onClick={handleDownload}
            className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            Download Document
          </button>
        </div>

        {/* Right: Comments */}
        <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg">
              Comments <span className="text-gray-400 font-normal text-sm">({comments.length})</span>
            </h2>
          </div>

          {/* Scrollable comment list */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {commentsLoading ? (
              <p className="text-gray-400 text-sm text-center py-4">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment: any) => (
                <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {comment.userId?.screen_name || 'Anonymous'}
                      {comment.userId?.teacher && (
                        <span className="ml-1 text-xs text-purple-600">(Teacher)</span>
                      )}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                      </span>
                      {!comment.userId?.teacher && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Comment Input */}
          <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white"
            />
            <button
              onClick={handleComment}
              disabled={commentMutation.isPending || !commentText.trim()}
              className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              {commentMutation.isPending ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
