import React from 'react';
import { render } from '@testing-library/react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/Map'), { ssr: false });

describe('Map Component', () => {
  test('renders without crashing', () => {
    render(<Map points={[]} />);
  });
});
