export interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  location: string;
  propertyType: string | string[];
  transactionType: string;
  bedrooms: string | string[];
  areaMin: string;
  areaMax: string;
}

export const getTransactionTypes = (t: (key: string) => string) => [
  { value: 'all', label: t('filters.transactionTypes.all') },
  { value: 'sale', label: t('filters.transactionTypes.sale') },
  { value: 'rent', label: t('filters.transactionTypes.rent') },
  { value: 'mortgage', label: t('filters.transactionTypes.mortgage') },
  { value: 'lease', label: t('filters.transactionTypes.lease') },
  { value: 'daily', label: t('filters.transactionTypes.daily') },
  { value: 'rent-to-buy', label: t('filters.transactionTypes.rentToBuy') }
];

// Legacy export for backward compatibility
export const transactionTypes = [
  { value: 'all', label: 'ყველა' },
  { value: 'sale', label: 'იყიდება' },
  { value: 'rent', label: 'ქირავდება' },
  { value: 'mortgage', label: 'გირავდება' },
  { value: 'lease', label: 'გაიცემა იჯარით' },
  { value: 'daily', label: 'ქირავდება დღიურად' },
  { value: 'rent-to-buy', label: 'ნასყიდობა გამოსყიდობის უფლებით' }
];

export const getPropertyTypes = (t: (key: string) => string) => [
  { value: 'all', label: t('filters.propertyTypes.all') },
  { value: 'apartment', label: t('filters.propertyTypes.apartment') },
  { value: 'house', label: t('filters.propertyTypes.house') },
  { value: 'cottage', label: t('filters.propertyTypes.cottage') },
  { value: 'land', label: t('filters.propertyTypes.land') },
  { value: 'commercial', label: t('filters.propertyTypes.commercial') },
  { value: 'office', label: t('filters.propertyTypes.office') },
  { value: 'hotel', label: t('filters.propertyTypes.hotel') }
];

// Legacy export for backward compatibility
export const propertyTypes = [
  { value: 'all', label: 'ყველა' },
  { value: 'apartment', label: 'ბინები' },
  { value: 'house', label: 'სახლები' },
  { value: 'cottage', label: 'აგარაკები' },
  { value: 'land', label: 'მიწის ნაკვეთები' },
  { value: 'commercial', label: 'კომერციული ფართები' },
  { value: 'office', label: 'საოფისე ფართები' },
  { value: 'hotel', label: 'სასტუმროები' }
];