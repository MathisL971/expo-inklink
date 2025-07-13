import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { createResponse, errorResponse } from "../utils/response";

interface EventFilters {
  format: string | null;
  disciplines: string[];
  languages: string[];
  eventType: string | null;
  searchTerm: string;
  startDateTime: string | null;
  endDateTime: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // New filtering parameters
  priceRange: string | null;
  hasFeaturedGuests: string | null;
  hasTickets: string | null;
  videoConferencePlatform: string | null;
  organizerId: string | null;
  timezone: string | null;
  minPrice: string | null;
  maxPrice: string | null;
  parkingAvailable: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string | null;
  locationVenue: string | null;

  // Duration and time filtering (calculated dynamically from startDate/endDate)
  duration: string | null;
  timeOfDay: string | null;

  // Accessibility filtering
  accessibilityFeatures: string[];
}

interface MongoFilter {
  format?: string;
  disciplines?: { $in: string[] };
  languages?: { $in: string[] };
  access?: string; // Used internally to filter for public events only
  eventType?: string;
  $or?: {
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    "address.street"?: { $regex: string; $options: string };
    "address.city"?: { $regex: string; $options: string };
    "address.state"?: { $regex: string; $options: string };
    "address.venue"?: { $regex: string; $options: string };
    "address.parkingDetails"?: { $regex: string; $options: string };
    "address.parkingInstructions"?: { $regex: string; $options: string };
  }[];
  startDate?: { $gte?: Date; $lt?: Date; $lte?: Date };
  endDate?: { $lte: Date };

  // New filtering options
  featuredGuests?: { $exists: boolean };
  ticketTiers?: { $exists: boolean };
  "videoConference.platform"?: string;
  organizerId?: string;
  timezone?: string;
  "ticketTiers.price"?: { $gte?: number; $lte?: number; $gt?: number; $eq?: number };
  "address.parkingAvailable"?: string;
  "address.city"?: { $regex: string; $options: string };
  "address.state"?: { $regex: string; $options: string };
  "address.country"?: { $regex: string; $options: string };
  "address.venue"?: { $regex: string; $options: string };

  // Accessibility filtering
  accessibilityFeatures?: { $in: string[] };
}

export async function handleEventsGET(event: APIGatewayProxyEventV2) {
  const { pathParameters, queryStringParameters } = event;
  const eventId = pathParameters?.id;

  if (eventId) {
    const singleEvent = await EventModel.findById(eventId);
    if (!singleEvent) {
      return errorResponse(404, "Event not found");
    }
    return createResponse(200, singleEvent);
  } else {
    const limit = queryStringParameters?.limit
      ? parseInt(queryStringParameters.limit)
      : 20;

    const skip = queryStringParameters?.skip
      ? parseInt(queryStringParameters.skip)
      : 0;

    const filter: MongoFilter = {
      // Always filter for public events only
      access: "Public"
    };
    const sortObj: Record<string, 1 | -1> = {
      startDate: 1
    };

    // Declare duration and timeOfDay variables outside the if block
    let duration: string | null = null;
    let timeOfDay: string | null = null;

    if (queryStringParameters) {
      const {
        format = null,
        disciplines = [],
        languages = [],
        eventType = null,
        searchTerm = '',
        startDateTime = null,
        endDateTime = null,
        sortBy = 'startDate',
        sortOrder = 'asc',

        // New filtering parameters
        priceRange = null,
        hasFeaturedGuests = null,
        hasTickets = null,
        videoConferencePlatform = null,
        organizerId = null,
        timezone = null,
        minPrice = null,
        maxPrice = null,
        parkingAvailable = null,
        locationCity = null,
        locationState = null,
        locationCountry = null,
        locationVenue = null,

        // Duration and time filtering (calculated dynamically from startDate/endDate)
        duration: durationParam = null,
        timeOfDay: timeOfDayParam = null,

        // Accessibility filtering
        accessibilityFeatures = []
      } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & EventFilters;

      // Assign the destructured values to the outer scope variables
      duration = durationParam;
      timeOfDay = timeOfDayParam;

      if (format) filter.format = format;
      if (disciplines?.length > 0) filter.disciplines = { $in: Array.isArray(disciplines) ? disciplines : [disciplines] };
      if (languages?.length > 0) filter.languages = { $in: Array.isArray(languages) ? languages : [languages] };
      if (eventType) filter.eventType = eventType;
      if (searchTerm) {
        filter.$or = [
          { title: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { "address.street": { $regex: searchTerm, $options: 'i' } },
          { "address.city": { $regex: searchTerm, $options: 'i' } },
          { "address.state": { $regex: searchTerm, $options: 'i' } },
          { "address.venue": { $regex: searchTerm, $options: 'i' } },
          { "address.parkingDetails": { $regex: searchTerm, $options: 'i' } },
          { "address.parkingInstructions": { $regex: searchTerm, $options: 'i' } }
        ];
      }
      // DateTime filtering
      if (startDateTime) {
        const startDate = new Date(startDateTime);
        if (!isNaN(startDate.getTime())) {
          filter.startDate = { $gte: startDate };
        }
      }

      if (endDateTime) {
        const endDate = new Date(endDateTime);
        if (!isNaN(endDate.getTime())) {
          // Filter events that start before or at endDateTime
          if (filter.startDate) {
            filter.startDate.$lte = endDate;
          } else {
            filter.startDate = { $lte: endDate };
          }
        }
      }

      // New filtering logic
      if (hasFeaturedGuests === 'true') {
        filter.featuredGuests = { $exists: true };
      }

      if (hasTickets === 'true') {
        filter.ticketTiers = { $exists: true };
      }

      if (videoConferencePlatform) {
        filter['videoConference.platform'] = videoConferencePlatform;
      }

      if (organizerId) {
        filter.organizerId = organizerId;
      }

      if (timezone) {
        filter.timezone = timezone;
      }

      if (parkingAvailable) {
        filter['address.parkingAvailable'] = parkingAvailable;
      }

      // Location filters
      if (locationCity) {
        filter['address.city'] = { $regex: locationCity, $options: 'i' };
      }

      if (locationState) {
        filter['address.state'] = { $regex: locationState, $options: 'i' };
      }

      if (locationCountry) {
        filter['address.country'] = { $regex: locationCountry, $options: 'i' };
      }

      if (locationVenue) {
        filter['address.venue'] = { $regex: locationVenue, $options: 'i' };
      }

      // Price range filtering
      if (minPrice || maxPrice) {
        const priceFilter: { $gte?: number; $lte?: number } = {};
        if (minPrice) priceFilter.$gte = parseFloat(minPrice);
        if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
        filter['ticketTiers.price'] = priceFilter;
      }

      // Handle predefined price ranges
      if (priceRange) {
        switch (priceRange) {
          case 'free':
            filter['ticketTiers.price'] = { $eq: 0 };
            break;
          case 'paid':
            filter['ticketTiers.price'] = { $gt: 0 };
            break;
          case 'low':
            filter['ticketTiers.price'] = { $gt: 0, $lte: 50 };
            break;
          case 'medium':
            filter['ticketTiers.price'] = { $gt: 50, $lte: 200 };
            break;
          case 'high':
            filter['ticketTiers.price'] = { $gt: 200 };
            break;
        }
      }

      // Accessibility features filtering
      if (accessibilityFeatures && accessibilityFeatures.length > 0) {
        filter.accessibilityFeatures = { $in: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : [accessibilityFeatures] };
      }

      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get total count based on database filters only
    const totalCount = await EventModel.countDocuments(filter);

    const events = await EventModel.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    let filteredEvents = events;

    // Apply dynamic filtering for duration and timeOfDay (calculated from startDate/endDate)
    if (duration) {
      filteredEvents = filteredEvents.filter(event => {
        if (!event.startDate || !event.endDate) return false;
        const start = new Date(event.startDate as Date);
        const end = new Date(event.endDate as Date);
        const durationMs = end.getTime() - start.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        switch (duration) {
          case 'Short (< 1 hour)':
            return durationHours < 1;
          case 'Medium (1-3 hours)':
            return durationHours >= 1 && durationHours < 3;
          case 'Long (3-4 hours)':
            return durationHours >= 3 && durationHours < 4;
          case 'Half Day (4-6 hours)':
            return durationHours >= 4 && durationHours < 6;
          case 'Full Day (6-24 hours)':
            return durationHours >= 6 && durationHours < 24;
          case 'Multi-Day':
            return durationHours >= 24;
          default:
            return true;
        }
      });
    }

    if (timeOfDay) {
      filteredEvents = filteredEvents.filter(event => {
        if (!event.startDate) return false;
        const start = new Date(event.startDate as Date);
        const startHour = start.getHours();

        switch (timeOfDay) {
          case 'Morning (6 AM - 12 PM)':
            return startHour >= 6 && startHour < 12;
          case 'Afternoon (12 PM - 6 PM)':
            return startHour >= 12 && startHour < 18;
          case 'Evening (6 PM - 10 PM)':
            return startHour >= 18 && startHour < 22;
          case 'Night (10 PM - 6 AM)':
            return startHour >= 22 || startHour < 6;
          default:
            return true;
        }
      });
    }

    const filteredCount = filteredEvents.length;

    return createResponse(200, {
      events: filteredEvents,
      count: filteredCount,
      totalCount: totalCount
    });
  }
}

export async function handleEventsPOST(event: APIGatewayProxyEventV2) {
  try {
    const eventData = JSON.parse(event.body || "{}");
    const newEvent = new EventModel(eventData);
    const savedEvent = await newEvent.save();
    return createResponse(201, savedEvent);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return errorResponse(400, "Validation error", error);
    }
    throw error;
  }
}

export async function handleEventsPUT(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.id;
  if (!eventId) {
    return errorResponse(400, "Event ID is required for PUT requests");
  }

  try {
    const eventData = JSON.parse(event.body || "{}");
    const updatedEvent = await EventModel.findByIdAndUpdate(
      eventId,
      eventData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return errorResponse(404, "Event not found");
    }

    return createResponse(200, updatedEvent);
  } catch (error: any) {
    if (error.name === "ValidationError") {
      return errorResponse(400, "Validation error", error);
    }
    throw error;
  }
}

export async function handleEventsDELETE(event: APIGatewayProxyEventV2) {
  const eventId = event.pathParameters?.id;
  if (!eventId) {
    return errorResponse(400, "Event ID is required for DELETE requests");
  }

  const deletedEvent = await EventModel.findByIdAndDelete(eventId);
  if (!deletedEvent) {
    return errorResponse(404, "Event not found");
  }

  return createResponse(200, {
    message: "Event deleted successfully",
    id: eventId,
  });
}
