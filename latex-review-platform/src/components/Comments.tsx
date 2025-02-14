'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

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
    
    if (!session) {
      router.push('/login');
      return;
    }

    if (!chapterId) {
      console.error('Missing chapterId');
      alert('错误：无法识别当前章节');
      return;
    }

    if (!newComment.trim()) {
      alert('请输入评论内容');
      return;
    }

    const commentData = {
      content: newComment.trim(),
      chapterId,
      parentId,
    };

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(commentData),
      });

      const data = await response.json();

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

  const renderCommentForm = (parentId?: string) => {
    if (!session) {
      return (
        <div className="mt-4">
          <button
            onClick={() => router.push('/login')}
            className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            请登录后发表评论
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={(e) => handleSubmit(e, parentId)} className="mt-4 space-y-4">
        <div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="写下你的评论..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            以 {session.user?.username || session.user?.name || 'Anonymous'} 的身份发表
          </span>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            发表评论
          </button>
        </div>
      </form>
    );
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8' : ''} mb-6`}>
      <div className="flex space-x-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">{comment.authorName}</span>
            <span className="text-sm text-gray-500">
              {new Date(comment.createdAt).toLocaleString('zh-CN')}
            </span>
          </div>
          <p className="text-gray-800">{comment.content}</p>
          <div className="flex items-center space-x-2">
            {!isReply && (
              <button
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {replyTo === comment.id ? '取消回复' : '回复'}
              </button>
            )}
          </div>
          {replyTo === comment.id && renderCommentForm(comment.id)}
          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">评论区</h3>
      {renderCommentForm()}
      <div className="mt-8 space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500">暂无评论</p>
        )}
      </div>
    </div>
  );
}
