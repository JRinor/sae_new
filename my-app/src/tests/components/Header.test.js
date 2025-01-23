import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Header from '../../components/Header';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import routes from '../../config/routes';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Header Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
    });
  });

  test('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  test('toggles menu on button click', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    expect(screen.getByText('JC')).toBeInTheDocument();
  });

  test('closes menu when clicking outside', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    fireEvent.click(document);
    expect(screen.queryByText('JC')).not.toBeInTheDocument();
  });

  test('navigates to home on logo click', () => {
    render(<Header />);
    const logo = screen.getByText('JC');
    fireEvent.click(logo);
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  test('navigates to route on menu item click', () => {
    render(<Header />);
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    const menuItem = screen.getByText(routes[1].name);
    fireEvent.click(menuItem);
    expect(mockPush).toHaveBeenCalledWith(routes[1].path); 
  });
});
