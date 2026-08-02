// Controlled vocabulary for the Northeast India experience database.
// Keeping these in one place makes exported data consistent and machine-readable.

export const STATES = [
  "Arunachal Pradesh",
  "Assam",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Sikkim",
  "Tripura",
] as const;

export const EXPERIENCE_TYPES = [
  "Trekking",
  "Wildlife & Safari",
  "Birdwatching",
  "Cultural Immersion",
  "Tribal Village Visit",
  "Festival",
  "Caving",
  "River Rafting",
  "Kayaking",
  "Angling",
  "Camping",
  "Cycling",
  "Motorbike Expedition",
  "Road Trip",
  "Heritage & History",
  "Food & Culinary",
  "Tea Estate",
  "Handloom & Craft",
  "Living Root Bridges",
  "Waterfall & Nature Walk",
  "Lake & Island",
  "Monastery & Spiritual",
  "Photography",
  "Wellness & Slow Travel",
  "Volunteering",
] as const;

export const DURATIONS = [
  "Under 2 hours",
  "Half day (2-4 hours)",
  "Full day (5-8 hours)",
  "1 night / 2 days",
  "2 nights / 3 days",
  "3-5 days",
  "6-9 days",
  "10+ days",
] as const;

export const DIFFICULTIES = [
  "Easy",
  "Easy to Moderate",
  "Moderate",
  "Moderate to Challenging",
  "Challenging",
  "Extreme",
] as const;

export const AGE_GROUPS = [
  "Kids (5-12)",
  "Teens (13-17)",
  "Young adults (18-30)",
  "Adults (31-50)",
  "Mature (51-65)",
  "Seniors (65+)",
  "All ages",
] as const;

export const SEASONS = [
  "Spring (Mar-Apr)",
  "Summer (May-Jun)",
  "Monsoon (Jul-Sep)",
  "Autumn (Oct-Nov)",
  "Winter (Dec-Feb)",
  "All year",
] as const;

export const TRANSPORT_OPTIONS = [
  "Shared sumo / jeep",
  "Private cab (sedan)",
  "Private cab (SUV)",
  "Tempo traveller",
  "Self-drive",
  "Motorbike",
  "Ferry / boat",
  "Train + road transfer",
  "Flight + road transfer",
  "Helicopter",
  "On foot",
] as const;

export const STAY_OPTIONS = [
  "Homestay",
  "Guesthouse",
  "Budget hotel",
  "Mid-range hotel",
  "Luxury resort",
  "Eco lodge",
  "Tented camp",
  "Forest rest house",
  "Monastery stay",
  "Camping (own gear)",
  "No stay required",
] as const;

export const FOOD_OPTIONS = [
  "Home-cooked local meals",
  "Tribal cuisine",
  "Assamese thali",
  "Vegetarian available",
  "Vegan available",
  "Jain / no onion-garlic",
  "Continental available",
  "Packed meals",
  "Self-arranged",
] as const;

export const IDEAL_FOR = [
  "Solo travellers",
  "Couples",
  "Families",
  "Friends group",
  "Senior citizens",
  "Corporate / MICE",
  "School & college groups",
  "Photographers",
  "Birders & naturalists",
  "Adventure seekers",
  "Slow travellers",
  "Researchers",
] as const;

export const CHALLENGE_OPTIONS = [
  "Rough road conditions",
  "Long driving hours",
  "High altitude",
  "Leeches during monsoon",
  "Limited mobile network",
  "No ATM nearby",
  "Basic washroom facilities",
  "Inner Line Permit required",
  "Landslide prone",
  "Steep climbs",
  "Limited food choices",
  "Erratic electricity",
] as const;

export type OptionList = readonly string[];
