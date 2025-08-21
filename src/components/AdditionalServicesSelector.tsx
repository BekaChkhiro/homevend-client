import React from 'react';
import { ServicesSelector } from './VipServicesSelector';

interface AdditionalService {
  serviceType: string;
  days: number;
  colorCode?: string;
}

interface AdditionalServicesSelectorProps {
  propertyId?: number;
  onServicesChange: (services: AdditionalService[]) => void;
  selectedServices?: AdditionalService[];
  showPurchaseButton?: boolean;
  onPurchase?: (services: AdditionalService[]) => Promise<void>;
}

export const AdditionalServicesSelector: React.FC<AdditionalServicesSelectorProps> = (props) => {
  return (
    <ServicesSelector 
      {...props} 
      showOnlyAdditionalServices={true} 
    />
  );
};