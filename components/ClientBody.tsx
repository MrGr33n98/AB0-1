'use client';

import { useEffect, useState } from 'react';

interface ClientBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}