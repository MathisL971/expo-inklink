import { Event } from "../types/index";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchEvents(): Promise<{
  events: Event[];
  count: number;
}> {
  const res = await fetch(`${baseUrl}/events`);
  return res.json();
}

export async function deleteEvent(id: string) {
  const res = await fetch(`${baseUrl}/events/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function createEvent(event: Omit<Event, "id">) {
  const res = await fetch(`${baseUrl}/events`, {
    method: "POST",
    body: JSON.stringify(event),
  });
  return res.json();
}

export async function updateEvent(event: Event) {
  const res = await fetch(`${baseUrl}/events/${event.id}`, {
    method: "PUT",
    body: JSON.stringify({
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
    }),
  });
  return res.json();
}
