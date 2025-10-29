import { z } from "zod";
import { phoneNumberSchema } from "@/lib/validation";

export const propertyFormSchema = z.object({
  // Basic Info
  title: z.string().min(1, "Property title is required"),
  propertyType: z.string().min(1, "Property type is required"),
  dealType: z.string().min(1, "Deal type is required"),
  dailyRentalSubcategory: z.string().optional(),
  projectId: z.string().optional(),
  district: z.string().optional(),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  streetNumber: z.string().optional(),
  cadastralCode: z.string()
    .regex(/^[0-9.]*$/, "validation.cadastralCode.invalidFormat")
    .optional(),

  // Property Details
  rooms: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  totalFloors: z.string().optional(),
  buildingStatus: z.string().optional(),
  constructionYear: z.string().optional(),
  condition: z.string().optional(),
  projectType: z.string().optional(),
  ceilingHeight: z.string().optional(),
  heating: z.string().optional(),
  parking: z.string().optional(),
  hotWater: z.string().optional(),
  buildingMaterial: z.string().optional(),

  // Conditional fields
  hasBalcony: z.boolean().default(false),
  balconyCount: z.string().optional(),
  balconyArea: z.string().optional(),
  
  hasPool: z.boolean().default(false),
  poolType: z.string().optional(),
  
  hasLivingRoom: z.boolean().default(false),
  livingRoomArea: z.string().optional(),
  livingRoomType: z.string().optional(),
  
  hasLoggia: z.boolean().default(false),
  loggiaArea: z.string().optional(),
  
  hasVeranda: z.boolean().default(false),
  verandaArea: z.string().optional(),
  
  hasYard: z.boolean().default(false),
  yardArea: z.string().optional(),
  
  hasStorage: z.boolean().default(false),
  storageArea: z.string().optional(),
  storageType: z.string().optional(),

  // Features (checkboxes)
  features: z.array(z.string()).default([]),
  
  // Advantages (checkboxes)
  advantages: z.array(z.string()).default([]),
  
  // Furniture & Appliances (checkboxes)
  furnitureAppliances: z.array(z.string()).default([]),
  
  // Tags (checkboxes)
  tags: z.array(z.string()).default([]),

  // Price & Area
  area: z.string().min(1, "Area is required"),
  totalPrice: z.string().min(1, "Total price is required"),
  pricePerSqm: z.string().optional(),
  currency: z.enum(["USD"]).default("USD"), // All prices stored in USD only

  // Contact Info
  contactName: z.string().min(1, "Name is required"),
  contactPhone: phoneNumberSchema,

  // Descriptions
  descriptionGeorgian: z.string().min(1, "Georgian description is required"),
  descriptionEnglish: z.string().min(1, "English description is required"),
  descriptionRussian: z.string().min(1, "Russian description is required"),

  // Photos
  photos: z.array(z.instanceof(File)).default([]),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;