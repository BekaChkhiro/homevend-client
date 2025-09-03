import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
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
    isLoading: false
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

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
    expect(screen.getByRole('heading', { name: /შესვლა/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/ელ-ფოსტა/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/პაროლი/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /შესვლა/i })).toBeInTheDocument();
  });

  it('updates form data when user types', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('submits form with correct data', async () => {
    mockLogin.mockResolvedValue(true);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    const submitButton = screen.getByRole('button', { name: /შესვლა/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('navigates to dashboard on successful login', async () => {
    mockLogin.mockResolvedValue(true);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    const submitButton = screen.getByRole('button', { name: /შესვლა/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error message on failed login', async () => {
    mockLogin.mockResolvedValue(false);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    const submitButton = screen.getByRole('button', { name: /შესვლა/i });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/არასწორი ელ-ფოსტა ან პაროლი/i)).toBeInTheDocument();
    });
  });

  it('shows error message on login exception', async () => {
    mockLogin.mockRejectedValue(new Error('Network error'));
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    const submitButton = screen.getByRole('button', { name: /შესვლა/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/შესვლისას დაფიქსირდა შეცდომა/i)).toBeInTheDocument();
    });
  });

  it('clears error message on new submission', async () => {
    mockLogin.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
    
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    const submitButton = screen.getByRole('button', { name: /შესვლა/i });
    
    // First submission - failure
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/არასწორი ელ-ფოსტა ან პაროლი/i)).toBeInTheDocument();
    });
    
    // Second submission - should clear error
    fireEvent.change(emailInput, { target: { value: 'correct@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.queryByText(/არასწორი ელ-ფოსტა ან პაროლი/i)).not.toBeInTheDocument();
    });
  });

  it('has link to registration page', () => {
    renderLogin();
    
    const registerLink = screen.getByRole('link', { name: /რეგისტრაცია/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('prevents form submission with empty fields', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    
    expect(emailInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('has proper input types', () => {
    renderLogin();
    
    const emailInput = screen.getByLabelText(/ელ-ფოსტა/i);
    const passwordInput = screen.getByLabelText(/პაროლი/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});