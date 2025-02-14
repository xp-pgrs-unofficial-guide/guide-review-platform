'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  content: string;
  authorName: string;
  replies: Comment[];
  createdAt: string;
}

interface CommentsProps {
  chapterId: string;
}

export default function Comments({ chapterId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    console.log('Comments component mounted with chapterId:', chapterId);
    fetchComments();
  }, [chapterId]);

  const fetchComments = async () => {
    try {
      console.log('Fetching comments for chapter:', chapterId);
      const response = await fetch(`/api/comments?chapterId=${chapterId}`);
      const data = await response.json();
      if (response.ok) {
        console.log('Received comments:', data);
        setComments(data);
      } else {
        console.error('Error response:', data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Chapter ID:', chapterId);
    console.log('Author Name:', authorName);
    console.log('Comment Content:', newComment);
    console.log('Parent ID:', parentId);

    if (!chapterId) {
      console.error('Missing chapterId');
      alert('错误：无法识别当前章节');
      return;
    }

    if (!authorName.trim()) {
      alert('请输入您的名字');
      return;
    }
    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    const commentData = {
      content: newComment.trim(),
      authorName: authorName.trim(),
      chapterId,
      parentId,
    };

    console.log('Submitting comment:', commentData);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        setNewComment('');
        setReplyTo(null);
        fetchComments();
      } else {
        console.error('Error response:', data);
        alert(`发表评论失败：${data.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('发表评论失败，请重试');
    }
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8' : ''} mb-6`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
            <span className="text-white">{comment.authorName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
          <div className="mt-2 text-sm space-x-4">
            <span className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                回复
              </button>
            )}
          </div>
          {replyTo === comment.id && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="您的名字"
                required
              />
              <div className="mt-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="写下您的回复..."
                  rows={2}
                  required
                />
              </div>
              <div className="mt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyTo(null);
                    setNewComment('');
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  回复
                </button>
              </div>
            </form>
          )}
          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)} className="mb-8">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2"
          placeholder="您的名字"
          required
        />
        <div className="border-b border-gray-200 focus-within:border-indigo-600">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="写下您的评论..."
            required
          />
        </div>
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            发表评论
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
