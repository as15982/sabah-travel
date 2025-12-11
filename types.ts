

export interface Location {
  lat: number;
  lng: number;
  name: string;
  url?: string; // Specific Google Maps shortlink
}

export interface FlightInfo {
  departureTime: string;
  departureCode: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalAirport: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
}

export interface ItineraryItemOption {
  activity: string;
  location: string;
  coords: Location;
  notes?: string;
  imageUrl?: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  duration?: number; // Duration in minutes for auto-scheduling
  activity: string;
  location: string;
  coords: Location; // For map pinning
  notes?: string;
  type: 'food' | 'activity' | 'transport' | 'relax';
  imageUrl?: string;
  options?: ItineraryItemOption[];
  travelTime?: string; // Time to travel to this location or next location
}

export interface DayPlan {
  date: string; // ISO date string YYYY-MM-DD
  weatherTemp: number;
  weatherCondition: string; // "Sunny", "Cloudy", "Rain"
  bgImage: string;
  flight?: FlightInfo;
  items: ItineraryItem[];
}

export interface Expense {
  id: string;
  amountMYR: number;
  amountTWD: number;
  category: 'food' | 'transport' | 'shopping' | 'stay' | 'other';
  description: string;
  date: string;
  time: string;
  payer: 'JIA' | 'KIA';
  paymentMethod: 'cash' | 'card';
  isSplit: boolean;
}

export interface ShoppingLocation {
  id: string;
  name: string;
  description: string;
  type: string;
  googleMapQuery: string;
  imageUrl?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  description: string;
  rating: number; // 1-5
  priceEstimate?: string; // e.g., "RM 20-40"
  imageUrl?: string;
  locationHint?: string;
}

export type Tab = 'plan' | 'map' | 'wallet' | 'shopping' | 'info';

export const EXCHANGE_RATE = 7.5; // Fixed estimated rate 1 MYR = 7.5 TWD