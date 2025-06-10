import axios from "axios";
import { Event } from "../types/index";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchEvents(): Promise<{
  events: Event[];
  count: number;
}> {
  const res = await axios.get(`${baseUrl}/events`);
  return res.data;
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
    location: event.location,
    source: event.source,
    format: event.format,
    disciplines: event.disciplines,
    access: event.access,
    organizerId: event.organizerId,
  });
  return res.data;
}

export async function fetchEvent(id: string): Promise<Event> {
  const res = await axios.get(`${baseUrl}/events/${id}`);
  return res.data;
}
