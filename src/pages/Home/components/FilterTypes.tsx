export interface FilterState {
  search: string;
  priceMin: string;
  priceMax: string;
  location: string;
  propertyType: string;
  transactionType: string;
  bedrooms: string;
  areaMin: string;
  areaMax: string;
}

export const transactionTypes = [
  { value: 'all', label: 'ყველა' },
  { value: 'sale', label: 'იყიდება' },
  { value: 'rent', label: 'ქირავდება' },
  { value: 'mortgage', label: 'გირავდება' },
  { value: 'lease', label: 'გაიცემა იჯარით' },
  { value: 'daily', label: 'ქირავდება დღიურად' },
  { value: 'rent-to-buy', label: 'ნასყიდობა გამოსყიდობის უფლებით' }
];

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