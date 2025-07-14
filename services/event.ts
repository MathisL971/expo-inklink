import axios from "axios";
import { Event, EventFilters } from "../types/index";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchEvents(): Promise<{
  events: Event[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/events`);
  return res.data;
}

export async function fetchEventsWithFilters(filters: EventFilters): Promise<{
  events: Event[];
  count: number;
}> {
  const queryParams = new URLSearchParams();

  if (filters.format) queryParams.append('format', filters.format);
  if (filters.disciplines.length > 0) {
    filters.disciplines.forEach(discipline =>
      queryParams.append('disciplines', discipline)
    );
  }
  if (filters.languages.length > 0) {
    filters.languages.forEach(language =>
      queryParams.append('languages', language)
    );
  }
  if (filters.eventType) queryParams.append('eventType', filters.eventType);
  if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
  if (filters.startDateTime) queryParams.append('startDateTime', filters.startDateTime);
  if (filters.endDateTime) queryParams.append('endDateTime', filters.endDateTime);

  // New filtering parameters
  if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
  if (filters.hasFeaturedGuests !== undefined) queryParams.append('hasFeaturedGuests', filters.hasFeaturedGuests.toString());
  if (filters.hasTickets !== undefined) queryParams.append('hasTickets', filters.hasTickets.toString());
  if (filters.videoConferencePlatform) queryParams.append('videoConferencePlatform', filters.videoConferencePlatform);
  if (filters.organizerId) queryParams.append('organizerId', filters.organizerId);
  if (filters.timezone) queryParams.append('timezone', filters.timezone);
  if (filters.minPrice !== undefined) queryParams.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice !== undefined) queryParams.append('maxPrice', filters.maxPrice.toString());
  if (filters.parkingAvailable) queryParams.append('parkingAvailable', filters.parkingAvailable);

  // Location filters
  if (filters.location?.city) queryParams.append('locationCity', filters.location.city);
  if (filters.location?.state) queryParams.append('locationState', filters.location.state);
  if (filters.location?.country) queryParams.append('locationCountry', filters.location.country);
  if (filters.location?.venue) queryParams.append('locationVenue', filters.location.venue);

  // Duration and time filtering (calculated dynamically on backend)
  if (filters.duration) queryParams.append('duration', filters.duration);
  if (filters.timeOfDay) queryParams.append('timeOfDay', filters.timeOfDay);

  // Accessibility features filtering
  if (filters.accessibilityFeatures && filters.accessibilityFeatures.length > 0) {
    filters.accessibilityFeatures.forEach(feature =>
      queryParams.append('accessibilityFeatures', feature)
    );
  }

  queryParams.append('sortBy', filters.sortBy);
  queryParams.append('sortOrder', filters.sortOrder);

  const res = await axios.get(`${baseUrl}/events?${queryParams.toString()}`);
  return res.data;
};

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
  return res.data;
}
