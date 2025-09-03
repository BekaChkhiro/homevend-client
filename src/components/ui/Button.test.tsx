import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button Component', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies default variant styling', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary', 'text-primary-foreground');
  });

  it('applies secondary variant styling', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary', 'text-secondary-foreground');
  });

  it('applies destructive variant styling', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive', 'text-destructive-foreground');
  });

  it('applies outline variant styling', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-input', 'bg-background');
  });

  it('applies ghost variant styling', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground');
  });

  it('applies link variant styling', () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary', 'underline-offset-4');
  });

  it('applies small size styling', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'rounded-md', 'px-3');
  });

  it('applies large size styling', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11', 'rounded-md', 'px-8');
  });

  it('applies icon size styling', () => {
    render(<Button size="icon">📧</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10', 'w-10');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Button with ref</Button>);
    expect(ref).toHaveBeenCalled();
  });

  it('supports asChild prop for rendering as different element', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('has proper focus styling', () => {
    render(<Button>Focus Button</Button>);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });

  it('has proper hover styling', () => {
    render(<Button>Hover Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-primary/90');
  });

  it('has proper transition styling', () => {
    render(<Button>Transition Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('transition-colors');
  });

  it('supports different button types', () => {
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('maintains accessibility with screen readers', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeInTheDocument();
  });
});