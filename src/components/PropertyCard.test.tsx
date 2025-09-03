import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { PropertyCard } from './PropertyCard';
import type { Property } from '@/pages/Index';

// Mock the FavoriteButton component
vi.mock('./FavoriteButton', () => ({
  FavoriteButton: ({ propertyId }: { propertyId: string }) => (
    <button data-testid={`favorite-${propertyId}`}>Favorite</button>
  )
}));

// Mock the useAuth hook
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, name: 'Test User' }
  })
}));

const mockProperty: Property = {
  id: '1',
  title: 'Test Property',
  description: 'A beautiful test property',
  propertyType: 'apartment',
  dealType: 'sale',
  area: 120,
  totalPrice: 200000,
  pricePerSqm: 1666.67,
  currency: 'GEL',
  rooms: 3,
  bedrooms: 2,
  bathrooms: 1,
  city: 'Tbilisi',
  district: 'Vake',
  street: 'Test Street',
  photos: [],
  contactName: 'John Doe',
  contactPhone: '+995555123456',
  vipStatus: 'none',
  vipExpiresAt: null,
  colorSeparationEnabled: false,
  colorSeparationExpiresAt: null,
  createdAt: '2025-01-01',
  viewCount: 10,
  favoriteCount: 2,
  inquiryCount: 1
};

const renderPropertyCard = (property: Property) => {
  return render(
    <BrowserRouter>
      <PropertyCard property={property} />
    </BrowserRouter>
  );
};

describe('PropertyCard Component', () => {
  it('renders property information correctly', () => {
    renderPropertyCard(mockProperty);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('Vake, Tbilisi')).toBeInTheDocument();
    expect(screen.getByText('Test Street')).toBeInTheDocument();
    expect(screen.getByText('200,000 ₾')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays VIP badge for VIP properties', () => {
    const vipProperty = {
      ...mockProperty,
      vipStatus: 'vip' as const,
      vipExpiresAt: new Date(Date.now() + 86400000).toISOString() // Tomorrow
    };
    
    renderPropertyCard(vipProperty);
    expect(screen.getByText('VIP')).toBeInTheDocument();
  });

  it('displays VIP+ badge for VIP Plus properties', () => {
    const vipPlusProperty = {
      ...mockProperty,
      vipStatus: 'vip_plus' as const,
      vipExpiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    
    renderPropertyCard(vipPlusProperty);
    expect(screen.getByText('VIP+')).toBeInTheDocument();
  });

  it('displays SUPER VIP badge for Super VIP properties', () => {
    const superVipProperty = {
      ...mockProperty,
      vipStatus: 'super_vip' as const,
      vipExpiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    
    renderPropertyCard(superVipProperty);
    expect(screen.getByText('SUPER VIP')).toBeInTheDocument();
  });

  it('does not display VIP badge for expired VIP', () => {
    const expiredVipProperty = {
      ...mockProperty,
      vipStatus: 'vip' as const,
      vipExpiresAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
    };
    
    renderPropertyCard(expiredVipProperty);
    expect(screen.queryByText('VIP')).not.toBeInTheDocument();
  });

  it('applies color separation styling when active', () => {
    const colorSeparationProperty = {
      ...mockProperty,
      colorSeparationEnabled: true,
      colorSeparationExpiresAt: new Date(Date.now() + 86400000).toISOString()
    };
    
    const { container } = renderPropertyCard(colorSeparationProperty);
    const card = container.querySelector('[data-testid="property-card"]');
    expect(card).toHaveClass('border-orange-500');
  });

  it('renders favorite button', () => {
    renderPropertyCard(mockProperty);
    expect(screen.getByTestId('favorite-1')).toBeInTheDocument();
  });

  it('renders property link with correct href', () => {
    renderPropertyCard(mockProperty);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/property/1');
  });

  it('handles missing property data gracefully', () => {
    const incompleteProperty = {
      ...mockProperty,
      bedrooms: undefined,
      bathrooms: undefined
    };
    
    renderPropertyCard(incompleteProperty as Property);
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });

  it('formats price correctly for different currencies', () => {
    const usdProperty = {
      ...mockProperty,
      currency: 'USD' as const,
      totalPrice: 100000
    };
    
    renderPropertyCard(usdProperty);
    // Should still show formatted price even if currency is different
    expect(screen.getByText(/100,000/)).toBeInTheDocument();
  });

  it('displays property type badge', () => {
    renderPropertyCard(mockProperty);
    expect(screen.getByText('apartment')).toBeInTheDocument();
  });

  it('displays deal type information', () => {
    const rentProperty = {
      ...mockProperty,
      dealType: 'rent' as const
    };
    
    renderPropertyCard(rentProperty);
    expect(screen.getByText('rent')).toBeInTheDocument();
  });

  it('handles properties with no photos', () => {
    renderPropertyCard(mockProperty);
    // Should render without errors even with empty photos array
    expect(screen.getByText('Test Property')).toBeInTheDocument();
  });

  it('displays contact information', () => {
    renderPropertyCard(mockProperty);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('+995555123456')).toBeInTheDocument();
  });
});