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
  { value: 'იყიდება', label: 'იყიდება' },
  { value: 'ქირავდება', label: 'ქირავდება' },
  { value: 'გირავდება', label: 'გირავდება' },
  { value: 'გაიცემა იჯარით', label: 'გაიცემა იჯარით' },
  { value: 'ქირავდება დღიურად', label: 'ქირავდება დღიურად' },
  { value: 'ნასყიდობა გამოსყიდობის უფლებით', label: 'ნასყიდობა გამოსყიდობის უფლებით' }
];

export const propertyTypes = [
  { value: 'all', label: 'ყველა' },
  { value: 'ბინები', label: 'ბინები' },
  { value: 'სახლები', label: 'სახლები' },
  { value: 'აგარაკები', label: 'აგარაკები' },
  { value: 'მიწის ნაკვეთები', label: 'მიწის ნაკვეთები' },
  { value: 'კომერციული ფართები', label: 'კომერციული ფართები' },
  { value: 'სასტუმროები', label: 'სასტუმროები' }
];