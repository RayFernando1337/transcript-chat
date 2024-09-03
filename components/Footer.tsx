import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="py-4 flex flex-col items-center justify-center space-y-2 text-xs sm:text-sm text-gray-500 bg-background border-t border-border">
      <div className="flex space-x-4">
        <Link href="https://x.com/RayFernando1337" target="_blank" rel="noopener noreferrer">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 hover:text-blue-400 transition-colors" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Link>
        <Link href="https://youtube.com/@RayFernando1337" target="_blank" rel="noopener noreferrer">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 hover:text-red-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </Link>
      </div>
      <div>Created by Ray Fernando</div>
    </footer>
  );
};