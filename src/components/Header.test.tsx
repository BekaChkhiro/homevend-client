import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock all the header subcomponents
vi.mock('./Header/index', () => ({
  Logo: () => <div data-testid="logo">HomeSale</div>,
  UserMenu: () => <div data-testid="user-menu">User Menu</div>,
  FavoritesButton: () => <button data-testid="favorites-button">Favorites</button>,
  AddPropertyButton: () => <button data-testid="add-property-button">Add Property</button>,
  Navigation: () => <nav data-testid="navigation">Navigation</nav>
}));

vi.mock('./Header/TabbedMobileMenu', () => ({
  TabbedMobileMenu: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="mobile-menu" style={{ display: isOpen ? 'block' : 'none' }}>
      Mobile Menu
    </div>
  )
}));

const renderHeader = () => {
  return render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  it('renders header elements correctly', () => {
    renderHeader();
    
    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
    expect(screen.getByTestId('favorites-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-property-button')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('shows mobile menu button on smaller screens', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
    expect(mobileMenuButton).toHaveClass('md:hidden');
  });

  it('toggles mobile menu when button is clicked', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    const mobileMenu = screen.getByTestId('mobile-menu');
    
    // Initially closed
    expect(mobileMenu).toHaveStyle('display: none');
    
    // Click to open
    fireEvent.click(mobileMenuButton);
    expect(mobileMenu).toHaveStyle('display: block');
    
    // Click to close
    fireEvent.click(mobileMenuButton);
    expect(mobileMenu).toHaveStyle('display: none');
  });

  it('shows correct icon when menu is closed', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    expect(mobileMenuButton.querySelector('[data-lucide="menu"]')).toBeInTheDocument();
  });

  it('shows correct icon when menu is open', () => {
    renderHeader();
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle mobile menu/i });
    
    // Open menu
    fireEvent.click(mobileMenuButton);
    expect(mobileMenuButton.querySelector('[data-lucide="x"]')).toBeInTheDocument();
  });

  it('has correct header styling and classes', () => {
    const { container } = renderHeader();
    
    const header = container.querySelector('header');
    expect(header).toHaveClass('bg-white', 'border-b', 'shadow-sm', 'fixed', 'top-0', 'z-50');
  });

  it('desktop controls are hidden on mobile', () => {
    renderHeader();
    
    const desktopControls = screen.getByTestId('favorites-button').closest('.hidden.md\\:flex');
    expect(desktopControls).toHaveClass('hidden', 'md:flex');
  });

  it('renders navigation component', () => {
    renderHeader();
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
  });

  it('header has proper responsive container', () => {
    const { container } = renderHeader();
    
    const headerContainer = container.querySelector('.container.mx-auto');
    expect(headerContainer).toBeInTheDocument();
    expect(headerContainer).toHaveClass('container', 'mx-auto', 'px-3', 'sm:px-4');
  });

  it('logo has proper flex styling', () => {
    renderHeader();
    
    const logoContainer = screen.getByTestId('logo').closest('.flex-shrink-0');
    expect(logoContainer).toHaveClass('flex-shrink-0');
  });

  it('maintains proper header height', () => {
    const { container } = renderHeader();
    
    const headerContent = container.querySelector('.h-14.sm\\:h-16');
    expect(headerContent).toHaveClass('h-14', 'sm:h-16');
  });
});