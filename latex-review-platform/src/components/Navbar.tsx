'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="fixed top-0 right-0 p-4 z-50 ml-64">
      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">
            {session.user?.username || session.user?.name}
          </span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            退出登录
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          登录
        </Link>
      )}
    </nav>
  );
}
