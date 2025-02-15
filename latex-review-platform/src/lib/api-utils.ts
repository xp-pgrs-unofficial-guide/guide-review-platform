export function getApiUrl(path: string): string {
  // Remove any leading slashes to prevent double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/${cleanPath}`;
} 