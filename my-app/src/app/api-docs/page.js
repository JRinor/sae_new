'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SwaggerDocs to avoid SSR issues
const SwaggerDocs = dynamic(() => import('@/components/SwaggerDocs'), { ssr: false });

const ApiDocsPage = () => {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    const fetchSpec = async () => {
      const res = await fetch('/api/docs');
      const data = await res.json();
      setSpec(data);
    };
    fetchSpec();
  }, []);

  if (!spec) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <SwaggerDocs spec={spec} />
    </div>
  );
};

export default ApiDocsPage;
