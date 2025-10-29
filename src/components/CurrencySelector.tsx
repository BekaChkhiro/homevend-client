import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DollarSign } from 'lucide-react';
import { useCurrency, type Currency } from '@/contexts/CurrencyContext';

interface CurrencyOption {
  code: Currency;
  name: string;
  symbol: string;
  flag: string;
}

const CurrencySelector: React.FC = () => {
  const { displayCurrency, setDisplayCurrency } = useCurrency();

  const currencies: CurrencyOption[] = [
    { code: 'GEL', name: 'ლარი', symbol: '₾', flag: '🇬🇪' },
    { code: 'USD', name: 'Dollar', symbol: '$', flag: '🇺🇸' },
  ];

  const currentCurrency = currencies.find(curr => curr.code === displayCurrency) || currencies[0];

  const changeCurrency = (currencyCode: Currency) => {
    setDisplayCurrency(currencyCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span>{currentCurrency.flag} {currentCurrency.symbol}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => changeCurrency(currency.code)}
            className="gap-2"
          >
            <span>{currency.flag}</span>
            <span>{currency.symbol} {currency.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
