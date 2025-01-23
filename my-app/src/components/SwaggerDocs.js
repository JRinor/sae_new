// src/components/SwaggerDocs.js
'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerDocs = () => {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/docs')
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) return <div>Loading...</div>;

  return (
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
};

export default SwaggerDocs;
