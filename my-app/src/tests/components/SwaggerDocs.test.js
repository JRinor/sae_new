import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import SwaggerDocs from '../../components/SwaggerDocs';
import '@testing-library/jest-dom';

jest.mock('swagger-ui-react', () => {
  return function MockSwaggerUI({ spec }) {
    return <div data-testid="swagger-ui">Swagger UI Mock with spec: {JSON.stringify(spec)}</div>;
  };
});

describe('SwaggerDocs Component', () => {
  const mockSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Test API',
      version: '1.0.0'
    }
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('renders loading state initially', () => {
    global.fetch.mockImplementationOnce(() => 
      new Promise(() => {})
    );
    
    render(<SwaggerDocs />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders SwaggerUI with spec data after successful fetch', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSpec)
      })
    );

    render(<SwaggerDocs />);

    await waitFor(() => {
      expect(screen.getByTestId('swagger-ui')).toBeInTheDocument();
    });
  });

  test('makes API call to correct endpoint', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSpec)
      })
    );

    render(<SwaggerDocs />);

    expect(global.fetch).toHaveBeenCalledWith('/api/docs');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('handles fetch error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Setup fetch mock to reject
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    // Render with act
    await act(async () => {
      render(<SwaggerDocs />);
    });

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error loading API documentation:')).toBeInTheDocument();
    }, { timeout: 3000 });

    consoleSpy.mockRestore();
  });
});
