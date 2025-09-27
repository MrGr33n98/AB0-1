import Link from 'next/link';
import Image from 'next/image';

const Header = () => (
  <div className="flex items-center">
    <Link href="/" className="flex items-center">
    <img 
      src="/images/logo.png" 
      alt="Logo" 
      className="h-10 w-auto"
    />
    {/* Removed "Compare Solar" text here */}
  </Link>
</div>

// ... existing code ...