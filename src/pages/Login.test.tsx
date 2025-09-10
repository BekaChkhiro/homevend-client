import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';

// Mock the Header component
vi.mock('@/components/Header', () => ({
  Header: () => <header data-testid="header">Header</header>
}));

// Mock the toast hook
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the auth context
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    user: null
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()]
  };
});

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' }
  })
}));

// Mock LanguageRoute
vi.mock('@/components/LanguageRoute', () => ({
  getLanguageUrl: (path: string, lang: string) => `/${lang}/${path}`
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /login.title/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/login.email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/login.password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login.loginButton/i })).toBeInTheDocument();
  });

  it('updates form data when user types', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data', async () => {
    mockLogin.mockResolvedValue(true);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('navigates to dashboard on successful login for regular user', async () => {
    mockLogin.mockResolvedValue(true);
    // Mock localStorage to return regular user
    const mockGetItem = vi.fn().mockReturnValue(JSON.stringify({ role: 'user' }));
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: mockGetItem },
      writable: true
    });
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/en/dashboard');
    });
  });

  it('navigates to admin dashboard on successful login for admin user', async () => {
    mockLogin.mockResolvedValue(true);
    // Mock localStorage to return admin user
    const mockGetItem = vi.fn().mockReturnValue(JSON.stringify({ role: 'admin' }));
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: mockGetItem },
      writable: true
    });
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123456' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/en/admin');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockResolvedValue(false);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/login.invalidCredentials/i)).toBeInTheDocument();
    });
  });

  it('shows error message on login exception', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/login.loginError/i)).toBeInTheDocument();
    });
  });

  it('clears error message on new submission', async () => {
    mockLogin.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    const submitButton = screen.getByRole('button', { name: /login.loginButton/i });
    
    // First submission - failure
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/login.invalidCredentials/i)).toBeInTheDocument();
    });
    
    // Second submission - should clear error
    fireEvent.change(emailInput, { target: { value: 'correct@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/login.invalidCredentials/i)).not.toBeInTheDocument();
    });
  });

  it('has link to registration page', () => {
    renderLogin();
    
    const registerLink = screen.getByRole('link', { name: /login.registerLink/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/en/register');
  });

  it('prevents form submission with empty fields', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('has proper input types', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/login.email/i);
    const passwordInput = screen.getByLabelText(/login.password/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});