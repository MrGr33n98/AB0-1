'use client';

import { useEffect, useState } from 'react';

interface ClientBodyProps {
  children: React.ReactNode;
  className?: string;
}

export default function ClientBody({ children, className }: ClientBodyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const removeGrammarlyAttributes = () => {
      const body = document.body;
      const attributesToRemove = [
        'data-new-gr-c-s-check-loaded',
        'data-gr-ext-installed'
      ];
      
      attributesToRemove.forEach(attr => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // Remove attributes immediately and set up an observer
    removeGrammarlyAttributes();
    
    // Create a MutationObserver to handle dynamic attribute additions
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          removeGrammarlyAttributes();
        }
      });
    });

    // Start observing the body element for attribute changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-new-gr-c-s-check-loaded', 'data-gr-ext-installed']
    });

    setMounted(true);

    return () => {
      observer.disconnect();
    };
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