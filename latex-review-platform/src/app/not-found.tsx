import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-3xl font-bold text-gray-900">404</h2>
        <p className="text-gray-600">页面未找到</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
} 