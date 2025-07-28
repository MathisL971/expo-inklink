import axios from "axios";
import { Event, EventFilters } from "../types/index";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchEvents(): Promise<{
  events: Event[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/events`);
  const data = res.data;

  // Transform ticket tiers to use 'id' instead of '_id' for each event
  if (data.events) {
    data.events = data.events.map((event: any) => {
      if (event.ticketTiers) {
        event.ticketTiers = event.ticketTiers.map((tier: any) => ({
          ...tier,
          id: tier._id || tier.id, // Use _id if present, fallback to id
        }));
      }
      return event;
    });
  }

  return data;
}

export async function fetchEventsWithFilters(filters: EventFilters): Promise<{
  events: Event[];
  count: number;
}> {
  const queryParams = new URLSearchParams();

  if (filters.format) queryParams.append('format', filters.format);
  if (filters.disciplines.length > 0) queryParams.append('disciplines', filters.disciplines.join(','));
  if (filters.languages.length > 0) queryParams.append('languages', filters.languages.join(','));
  if (filters.eventType) queryParams.append('eventType', filters.eventType);
  if (filters.startDateTime) queryParams.append('startDateTime', filters.startDateTime);
  if (filters.endDateTime) queryParams.append('endDateTime', filters.endDateTime);
  if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
  if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
  if (filters.hasFeaturedGuests !== undefined) queryParams.append('hasFeaturedGuests', filters.hasFeaturedGuests.toString());
  if (filters.hasTickets !== undefined) queryParams.append('hasTickets', filters.hasTickets.toString());
  if (filters.videoConferencePlatform) queryParams.append('videoConferencePlatform', filters.videoConferencePlatform);
  if (filters.organizerId) queryParams.append('organizerId', filters.organizerId);
  if (filters.timezone) queryParams.append('timezone', filters.timezone);
  if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
  if (filters.parkingAvailable) queryParams.append('parkingAvailable', filters.parkingAvailable);
  if (filters.duration) queryParams.append('duration', filters.duration);
  if (filters.timeOfDay) queryParams.append('timeOfDay', filters.timeOfDay);
  if (filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) queryParams.append('accessibilityFeatures', filters.accessibilityFeatures.join(','));

  // Location filters
  if (filters.location?.city) queryParams.append('locationCity', filters.location.city);
  if (filters.location?.state) queryParams.append('locationState', filters.location.state);
  if (filters.location?.country) queryParams.append('locationCountry', filters.location.country);
  if (filters.location?.venue) queryParams.append('locationVenue', filters.location.venue);

  const res = await axios.get(`${baseUrl}/events?${queryParams.toString()}`);
  const data = res.data;

  // Transform ticket tiers to use 'id' instead of '_id' for each event
  if (data.events) {
    data.events = data.events.map((event: any) => {
      if (event.ticketTiers) {
        event.ticketTiers = event.ticketTiers.map((tier: any) => ({
          ...tier,
          id: tier._id || tier.id, // Use _id if present, fallback to id
        }));
      }
      return event;
    });
  }

  return data;
}

export async function deleteEvent(id: string) {
  const res = await axios.delete(`${baseUrl}/events/${id}`);
  return res.data;
}

export async function createEvent(event: Omit<Event, "id">) {
  const res = await axios.post(`${baseUrl}/events`, event);
  return res.data;
}

export async function updateEvent(event: Event) {
  const res = await axios.put(`${baseUrl}/events/${event.id}`, {
    title: event.title,
    description: event.description,
    note: event.note,
    image: event.image,
    startDate: event.startDate,
    endDate: event.endDate,
    timezone: event.timezone,
    eventType: event.eventType,
    address: event.address,
    videoConference: event.videoConference,
    source: event.source,
    format: event.format,
    disciplines: event.disciplines,
    languages: event.languages,
    access: event.access,
    ticketTiers: event.ticketTiers,
    featuredGuests: event.featuredGuests,
    organizerId: event.organizerId,
    totalTickets: event.totalTickets,
    availableTickets: event.availableTickets,
    status: event.status,
  });
  return res.data;
}

export async function fetchEvent(id: string): Promise<Event> {
  const res = await axios.get(`${baseUrl}/events/${id}`);
  const event = res.data;

  // Transform ticket tiers to use 'id' instead of '_id'
  if (event.ticketTiers) {
    event.ticketTiers = event.ticketTiers.map((tier: any) => ({
      ...tier,
      id: tier._id || tier.id, // Use _id if present, fallback to id
    }));
  }

  return event;
}
