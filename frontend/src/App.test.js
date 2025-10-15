import { render, screen } from '@testing-library/react';
import App from './App';

// Mock child components to simplify testing
jest.mock('./components/common/NavigationBar', () => () => <div data-testid="navigation-bar">NavigationBar</div>);
jest.mock('./components/ServiceBookingForm/ServiceBookingForm', () => () => <div data-testid="booking-form">ServiceBookingForm</div>);
jest.mock('./components/ServiceDashboard/ServiceDashboard', () => () => <div data-testid="service-dashboard">ServiceDashboard</div>);
jest.mock('./components/CalendarInterface/CalendarInterface', () => () => <div data-testid="calendar">CalendarInterface</div>);
jest.mock('./components/CustomerDashboard/CustomerDashboard', () => () => <div data-testid="customer-dashboard">CustomerDashboard</div>);
jest.mock('./components/AdminPanel/AdminPanel', () => () => <div data-testid="admin-panel">AdminPanel</div>);

// Mock context to avoid provider issues
jest.mock('./contexts/AppContext', () => ({
  useAppContext: () => ({
    state: {
      user: null,
      appointments: [],
      services: [],
      loading: false
    },
    actions: {
      setUser: jest.fn(),
      setAppointments: jest.fn(),
      setServices: jest.fn()
    }
  }),
  AppProvider: ({ children }) => children
}));

// Mock auth hook
jest.mock('./hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    isAuthenticated: false,
    login: jest.fn(),
    logout: jest.fn()
  })
}));

describe('App Component', () => {
  test('renders Technova Booking App with navigation', () => {
    render(<App />);
    
    // Check if navigation is rendered
    const navigationElement = screen.getByTestId('navigation-bar');
    expect(navigationElement).toBeInTheDocument();
  });

  test('renders booking form on home route', () => {
    render(<App />);
    
    // Check if booking form is rendered by default
    const bookingForm = screen.getByTestId('booking-form');
    expect(bookingForm).toBeInTheDocument();
  });

  test('app has main content area', () => {
    render(<App />);
    
    const mainContent = screen.getByRole('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('main-content');
  });
});

// Additional component tests can be added here
describe('Utility Functions', () => {
  test('sample utility test', () => {
    expect(1 + 1).toBe(2);
  });
});