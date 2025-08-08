import React, { useState } from "react";
import { FavoritePropertyCard } from "./FavoritePropertyCard";
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Test favorite properties data
const testFavoriteProperties = [
  {
    id: 4001,
    title: "ლუქსუსური პენტჰაუსი ვაკეში",
    price: 380000,
    address: "ვაკე, თბილისი",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    type: "ბინები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&h=300&fit=crop",
    featured: true,
    addedDate: "2024-01-20",
    ownerName: "გიორგი მელაძე",
    ownerPhone: "+995 599 123 456",
  },
  {
    id: 4002,
    title: "კომფორტული ბინა საბურთალოში",
    price: 180000,
    address: "საბურთალო, თბილისი",
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    type: "ბინები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=500&h=300&fit=crop",
    featured: false,
    addedDate: "2024-01-18",
    ownerName: "ნინო ხარაძე",
    ownerPhone: "+995 555 987 654",
  },
  {
    id: 4003,
    title: "ახალი ბინა ისანში",
    price: 95000,
    address: "ისანი, თბილისი",
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    type: "ბინები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?w=500&h=300&fit=crop",
    featured: false,
    addedDate: "2024-01-15",
    ownerName: "დავით ლომიძე",
    ownerPhone: "+995 577 456 789",
  },
  {
    id: 4004,
    title: "სტუდია ძველ თბილისში",
    price: 85000,
    address: "ძველი თბილისი",
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    type: "ბინები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop",
    featured: false,
    addedDate: "2024-01-10",
    ownerName: "მარიამ წიწკიშვილი",
    ownerPhone: "+995 593 321 654",
  },
  {
    id: 4005,
    title: "კოტეჯი დიდ დიღომში",
    price: 220000,
    address: "დიდი დიღომი, თბილისი",
    bedrooms: 3,
    bathrooms: 2,
    area: 160,
    type: "სახლები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=300&fit=crop",
    featured: false,
    addedDate: "2024-01-12",
    ownerName: "ლევან გელაშვილი",
    ownerPhone: "+995 568 147 258",
  },
  {
    id: 4006,
    title: "ვილა მთაწმინდაზე",
    price: 450000,
    address: "მთაწმინდა, თბილისი",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    type: "აგარაკები",
    transactionType: "იყიდება",
    image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=500&h=300&fit=crop",
    featured: true,
    addedDate: "2024-01-08",
    ownerName: "ანა ჯავახიშვილი",
    ownerPhone: "+995 579 852 741",
  }
];

export const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const hasFavorites = testFavoriteProperties.length > 0;
  
  return (
    <>
      <h2 className="text-xl font-medium mb-4">ფავორიტები</h2>

      {hasFavorites ? (
        <div className="space-y-3">
          {testFavoriteProperties.map((property) => (
            <FavoritePropertyCard
              key={property.id}
              {...property}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border text-center">
          <div className="max-w-xs mx-auto">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-2">თქვენ არ გაქვთ ფავორიტებში დამატებული განცხადებები</h3>
            <p className="text-sm text-gray-500 mb-4">
              მოძებნეთ სასურველი განცხადებები და დაამატეთ ფავორიტებში მომავალი განხილვისთვის
            </p>
            <Button 
              className="flex items-center mx-auto"
              onClick={() => navigate('/listings')}
            >
              <Search className="h-4 w-4 mr-1" />
              განცხადებების ძებნა
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
