import type { Experience } from "@/lib/experiences";

export type ItineraryDay = {
  id: string;
  title: string;
  items: Experience[];
};

export type ItineraryMeta = {
  title: string;
  clientName: string;
  travelDates: string;
  companyName: string;
};

export type ItineraryData = ItineraryMeta & {
  days: ItineraryDay[];
};

export const newDay = (index: number): ItineraryDay => ({
  id: `day-${Date.now()}-${index}`,
  title: "",
  items: [],
});
