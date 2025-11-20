import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Home, Thermometer, Car, Droplets, Building, Waves, Sofa, TreePine, Warehouse, Sailboat, Tally4, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";

export const PropertyDetailsSection = () => {
  const { t } = useTranslation(['userDashboard', 'admin']);
  const form = useFormContext();

  // Watch form values for conditional rendering
  const hasBalcony = form.watch("hasBalcony");
  const hasPool = form.watch("hasPool");
  const hasLivingRoom = form.watch("hasLivingRoom");
  const hasLoggia = form.watch("hasLoggia");
  const hasVeranda = form.watch("hasVeranda");
  const hasYard = form.watch("hasYard");
  const hasStorage = form.watch("hasStorage");



  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-center space-x-2 border-b pb-2 sm:pb-3 mb-2">
        <Home className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
        <h3 className="text-lg sm:text-xl font-semibold">{t('addPropertyForm.propertyDetails.title')}</h3>
      </div>

      {/* Rooms */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.roomCount')}</Label>
        <FormField
          control={form.control}
          name="rooms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((num) => {
                    const isSelected = field.value === num.toString();
                    return (
                      <div key={num} className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => field.onChange(num.toString())}
                          className={`flex items-center justify-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors min-w-[40px] sm:min-w-[45px] min-h-[40px] sm:min-h-[45px] text-sm sm:text-base touch-manipulation ${isSelected
                            ? 'border-primary bg-accent font-medium'
                            : 'border-input bg-background hover:bg-accent hover:border-ring'
                            }`}
                        >
                          {num}
                        </button>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Bedrooms */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.bedroomCount')}</Label>
        <FormField
          control={form.control}
          name="bedrooms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, "10+"].map((num) => {
                    const isSelected = field.value === num.toString();
                    return (
                      <div key={num} className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => field.onChange(num.toString())}
                          className={`flex items-center justify-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors min-w-[40px] sm:min-w-[45px] min-h-[40px] sm:min-h-[45px] text-sm sm:text-base touch-manipulation ${isSelected
                            ? 'border-primary bg-accent font-medium'
                            : 'border-input bg-background hover:bg-accent hover:border-ring'
                            }`}
                        >
                          {num}
                        </button>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Bathrooms */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.propertyDetails.bathroomCount')}</span>
        </Label>
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {[
                    { value: "1", label: "1" },
                    { value: "2", label: "2" },
                    { value: "3", label: "3+" },
                    { value: "shared", label: t('addPropertyForm.propertyDetails.bathroomTypes.shared') }
                  ].map((option) => {
                    const isSelected = field.value === option.value;
                    return (
                      <div key={option.value} className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={`flex items-center justify-center border rounded-md p-2 sm:p-3 cursor-pointer transition-colors min-w-[50px] sm:min-w-[60px] min-h-[40px] sm:min-h-[45px] text-sm sm:text-base touch-manipulation ${isSelected
                            ? 'border-primary bg-accent font-medium'
                            : 'border-input bg-background hover:bg-accent hover:border-ring'
                            }`}
                        >
                          {option.label}
                        </button>
                      </div>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Total Floors */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.totalFloors')}</Label>
        <FormField
          control={form.control}
          name="totalFloors"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder={t('addPropertyForm.propertyDetails.floorsPlaceholder')}
                  className="h-11 sm:h-12 text-sm sm:text-base border-input focus:ring-ring focus:ring-1"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Building Status */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.propertyDetails.buildingStatus')}</span>
        </Label>
        <FormField
          control={form.control}
          name="buildingStatus"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {[
                    { value: "old-built", label: t('addPropertyForm.propertyDetails.buildingStatuses.old-built') },
                    { value: "new-built", label: t('addPropertyForm.propertyDetails.buildingStatuses.new-built') },
                    { value: "under-construction", label: t('addPropertyForm.propertyDetails.buildingStatuses.under-construction') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`status-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`status-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Construction Year */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.constructionYear')}</Label>
        <FormField
          control={form.control}
          name="constructionYear"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {[
                    { value: "before-1955", label: "<1955" },
                    { value: "1955-2000", label: "1955-2000" },
                    { value: "after-2000", label: ">2000" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`year-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`year-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Condition */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.condition')}</Label>
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {[
                    { value: "newly-renovated", label: t('addPropertyForm.propertyDetails.conditions.newly-renovated') },
                    { value: "old-renovated", label: t('addPropertyForm.propertyDetails.conditions.old-renovated') },
                    { value: "ongoing-renovation", label: t('addPropertyForm.propertyDetails.conditions.ongoing-renovation') },
                    { value: "needs-renovation", label: t('addPropertyForm.propertyDetails.conditions.needs-renovation') },
                    { value: "white-frame", label: t('addPropertyForm.propertyDetails.conditions.white-frame') },
                    { value: "black-frame", label: t('addPropertyForm.propertyDetails.conditions.black-frame') },
                    { value: "green-frame", label: t('addPropertyForm.propertyDetails.conditions.green-frame') },
                    { value: "white-plus", label: t('addPropertyForm.propertyDetails.conditions.white-plus') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`condition-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`condition-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Project Type */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.projectType')}</Label>
        <FormField
          control={form.control}
          name="projectType"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                >
                  {[
                    { value: "non-standard", label: t('addPropertyForm.propertyDetails.propertyStyles.non-standard') },
                    { value: "villa", label: t('addPropertyForm.propertyDetails.propertyStyles.villa') },
                    { value: "townhouse", label: t('addPropertyForm.propertyDetails.propertyStyles.townhouse') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`project-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`project-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Ceiling Height */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.ceilingHeight')}</Label>
        <FormField
          control={form.control}
          name="ceilingHeight"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.1"
                  placeholder={t('addPropertyForm.propertyDetails.ceilingHeightPlaceholder')}
                  className="h-11 sm:h-12 text-sm sm:text-base border-input focus:ring-ring focus:ring-1"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Heating */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.propertyDetails.heatingType')}</span>
        </Label>
        <FormField
          control={form.control}
          name="heating"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    { value: "central-heating", label: t('addPropertyForm.propertyDetails.heatingTypes.central-heating') },
                    { value: "gas-heater", label: t('addPropertyForm.propertyDetails.heatingTypes.gas-heater') },
                    { value: "electric-heater", label: t('addPropertyForm.propertyDetails.heatingTypes.electric-heater') },
                    { value: "central-floor", label: t('addPropertyForm.propertyDetails.heatingTypes.central-floor') },
                    { value: "no-heating", label: t('addPropertyForm.propertyDetails.heatingTypes.no-heating') },
                    { value: "individual", label: t('addPropertyForm.propertyDetails.heatingTypes.individual') },
                    { value: "floor-heating", label: t('addPropertyForm.propertyDetails.heatingTypes.floor-heating') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`heating-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`heating-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Parking */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium flex items-center gap-2">
          <Car className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.propertyDetails.parkingType')}</span>
        </Label>
        <FormField
          control={form.control}
          name="parking"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    { value: "garage", label: t('addPropertyForm.propertyDetails.parkingTypes.garage') },
                    { value: "parking-space", label: t('addPropertyForm.propertyDetails.parkingTypes.parking-space') },
                    { value: "yard-parking", label: t('addPropertyForm.propertyDetails.parkingTypes.yard-parking') },
                    { value: "underground-parking", label: t('addPropertyForm.propertyDetails.parkingTypes.underground-parking') },
                    { value: "paid-parking", label: t('addPropertyForm.propertyDetails.parkingTypes.paid-parking') },
                    { value: "no-parking", label: t('addPropertyForm.propertyDetails.parkingTypes.no-parking') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`parking-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`parking-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Hot Water */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          <span>{t('addPropertyForm.propertyDetails.hotWaterType')}</span>
        </Label>
        <FormField
          control={form.control}
          name="hotWater"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    { value: "gas-water-heater", label: t('addPropertyForm.propertyDetails.hotWaterTypes.gas-water-heater') },
                    { value: "boiler", label: t('addPropertyForm.propertyDetails.hotWaterTypes.boiler') },
                    { value: "electric-water-heater", label: t('addPropertyForm.propertyDetails.hotWaterTypes.electric-water-heater') },
                    { value: "solar-heater", label: t('addPropertyForm.propertyDetails.hotWaterTypes.solar-heater') },
                    { value: "no-hot-water", label: t('addPropertyForm.propertyDetails.hotWaterTypes.no-hot-water') },
                    { value: "central-hot-water", label: t('addPropertyForm.propertyDetails.hotWaterTypes.central-hot-water') },
                    { value: "natural-hot-water", label: t('addPropertyForm.propertyDetails.hotWaterTypes.natural-hot-water') },
                    { value: "individual", label: t('addPropertyForm.propertyDetails.hotWaterTypes.individual') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`hot-water-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`hot-water-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Building Material */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <Label className="block mb-3 font-medium text-sm sm:text-base">{t('addPropertyForm.propertyDetails.wallMaterial')}</Label>
        <FormField
          control={form.control}
          name="buildingMaterial"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {[
                    { value: "block", label: t('addPropertyForm.propertyDetails.wallMaterials.block') },
                    { value: "brick", label: t('addPropertyForm.propertyDetails.wallMaterials.brick') },
                    { value: "wood", label: t('addPropertyForm.propertyDetails.wallMaterials.wood') },
                    { value: "reinforced-concrete", label: t('addPropertyForm.propertyDetails.wallMaterials.reinforced-concrete') },
                    { value: "combined", label: t('addPropertyForm.propertyDetails.wallMaterials.combined') }
                  ].map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`material-${option.value}`}
                      className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                    >
                      <RadioGroupItem value={option.value} id={`material-${option.value}`} />
                      <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Balcony */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasBalcony"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-balcony"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Tally4 className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="has-balcony" className="font-medium">{t('addPropertyForm.propertyDetails.balcony')}</Label>
              </div>
            </FormItem>
          )}
        />
        {hasBalcony && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="balconyCount"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.balconyCount')}</Label>
                  <FormControl>
                    <Input {...field} type="number" placeholder={t('addPropertyForm.propertyDetails.storageCountPlaceholder')} className="h-10 sm:h-11 text-sm sm:text-base border-input focus:ring-ring focus:ring-1" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balconyArea"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.balconyArea')}</Label>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.storageAreaPlaceholder')} className="h-10 sm:h-11 text-sm sm:text-base border-input focus:ring-ring focus:ring-1" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Pool */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasPool"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-pool"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label htmlFor="has-pool" className="font-medium flex items-center gap-2">
                  <Waves className="h-4 w-4 text-muted-foreground" />
                  <span>{t('addPropertyForm.propertyDetails.pool')}</span>
                </Label>
              </div>
            </FormItem>
          )}
        />
        {hasPool && (
          <FormField
            control={form.control}
            name="poolType"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.poolType')}</Label>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {[
                      { value: "outdoor", label: t('addPropertyForm.propertyDetails.poolTypes.outdoor') },
                      { value: "indoor", label: t('addPropertyForm.propertyDetails.poolTypes.indoor') }
                    ].map((option) => (
                      <label
                        key={option.value}
                        htmlFor={`pool-type-${option.value}`}
                        className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                      >
                        <RadioGroupItem value={option.value} id={`pool-type-${option.value}`} />
                        <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                      </label>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Living Room */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasLivingRoom"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-living-room"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label htmlFor="has-living-room" className="font-medium flex items-center gap-2">
                  <Sofa className="h-4 w-4 text-muted-foreground" />
                  <span>{t('addPropertyForm.propertyDetails.livingRoom')}</span>
                </Label>
              </div>
            </FormItem>
          )}
        />
        {hasLivingRoom && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="livingRoomArea"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.livingRoomArea')}</Label>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.verandaAreaPlaceholder')} className="h-10 sm:h-11 text-sm sm:text-base border-input focus:ring-ring focus:ring-1" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="livingRoomType"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.livingRoomType')}</Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {[
                        { value: "separate", label: t('addPropertyForm.propertyDetails.livingRoomTypes.separate') },
                        { value: "studio", label: t('addPropertyForm.propertyDetails.livingRoomTypes.studio') }
                      ].map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`living-room-type-${option.value}`}
                          className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                        >
                          <RadioGroupItem value={option.value} id={`living-room-type-${option.value}`} />
                          <span className="group-data-[state=checked]:font-medium">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Loggia */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasLoggia"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-loggia"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Landmark className="h-4 w-4 text-muted-foreground"/>
                <Label htmlFor="has-loggia" className="font-medium">{t('addPropertyForm.propertyDetails.loggia')}</Label>
              </div>
            </FormItem>
          )}
        />
        {hasLoggia && (
          <FormField
            control={form.control}
            name="loggiaArea"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.loggiaArea')}</Label>
                <FormControl>
                  <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.verandaAreaPlaceholder')} className="border-input focus:ring-ring focus:ring-1" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Veranda */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasVeranda"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-veranda"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Sailboat className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="has-veranda" className="font-medium">{t('addPropertyForm.propertyDetails.veranda')}</Label>
              </div>
            </FormItem>
          )}
        />
        {hasVeranda && (
          <FormField
            control={form.control}
            name="verandaArea"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.verandaArea')}</Label>
                <FormControl>
                  <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.verandaAreaPlaceholder')} className="border-input focus:ring-ring focus:ring-1" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Yard */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasYard"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-yard"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label htmlFor="has-yard" className="font-medium flex items-center gap-2">
                  <TreePine className="h-4 w-4 text-muted-foreground" />
                  <span>{t('addPropertyForm.propertyDetails.hasYard')}</span>
                </Label>
              </div>
            </FormItem>
          )}
        />
        {hasYard && (
          <FormField
            control={form.control}
            name="yardArea"
            render={({ field }) => (
              <FormItem>
                <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.yardArea')}</Label>
                <FormControl>
                  <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.verandaAreaPlaceholder')} className="border-input focus:ring-ring focus:ring-1" />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Storage */}
      <div className="rounded-md border border-border p-2 sm:p-3 md:p-4 lg:p-5">
        <FormField
          control={form.control}
          name="hasStorage"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2 mb-4">
                <FormControl>
                  <Checkbox
                    id="has-storage"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <Label htmlFor="has-storage" className="font-medium flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span>{t('addPropertyForm.propertyDetails.storageType')}</span>
                </Label>
              </div>
            </FormItem>
          )}
        />
        {hasStorage && (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="storageArea"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.storageArea')}</Label>
                  <FormControl>
                    <Input {...field} type="number" step="0.1" placeholder={t('addPropertyForm.propertyDetails.verandaAreaPlaceholder')} className="h-10 sm:h-11 text-sm sm:text-base border-input focus:ring-ring focus:ring-1" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storageType"
              render={({ field }) => (
                <FormItem>
                  <Label className="text-sm mb-2 block">{t('addPropertyForm.propertyDetails.storageTypeLabel')}</Label>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {[
                        { value: "basement", label: t('addPropertyForm.propertyDetails.storageTypes.basement') },
                        { value: "external-storage", label: t('addPropertyForm.propertyDetails.storageTypes.external-storage') },
                        { value: "shared-storage", label: t('addPropertyForm.propertyDetails.storageTypes.shared-storage') }
                      ].map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`storage-type-${option.value}`}
                          className="flex items-center space-x-2 border border-input bg-background rounded-md p-3 sm:p-4 cursor-pointer hover:bg-accent hover:border-ring transition-colors group data-[state=checked]:border-primary data-[state=checked]:bg-accent min-h-[48px] touch-manipulation"
                        >
                          <RadioGroupItem value={option.value} id={`storage-type-${option.value}`} />
                          <span className="group-data-[state=checked]:font-medium text-sm">{option.label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};