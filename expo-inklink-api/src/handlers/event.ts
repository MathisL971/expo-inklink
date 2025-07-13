import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { createResponse, errorResponse } from "../utils/response";

interface EventFilters {
  format: string | null;
  disciplines: string[];
  languages: string[];
  eventType: string | null;
  search: string;
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

  // Duration and time filtering
  duration: string | null;
  timeOfDay: string | null;

  // Accessibility and inclusivity filtering
  accessibilityFeatures: string[];
  inclusivityFeatures: string[];
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
  startDate?: { $gte: Date; $lt?: Date };
  endDate?: { $lte: Date };

  // New filtering options
  featuredGuests?: { $exists: boolean };
  ticketTiers?: { $exists: boolean };
  "videoConference.platform"?: string;
  organizerId?: string;
  timezone?: string;
  "ticketTiers.price"?: { $gte?: number; $lte?: number };
  "address.parkingAvailable"?: string;
  "address.city"?: { $regex: string; $options: string };
  "address.state"?: { $regex: string; $options: string };
  "address.country"?: { $regex: string; $options: string };
  "address.venue"?: { $regex: string; $options: string };

  // Duration and time filtering
  duration?: string;
  timeOfDay?: string;

  // Accessibility and inclusivity filtering
  accessibilityFeatures?: { $in: string[] };
  inclusivityFeatures?: { $in: string[] };
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

    if (queryStringParameters) {
      const {
        format = null,
        disciplines = [],
        languages = [],
        eventType = null,
        search = '',
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

        // Duration and time filtering
        duration = null,
        timeOfDay = null,

        // Accessibility and inclusivity filtering
        accessibilityFeatures = [],
        inclusivityFeatures = []
      } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & EventFilters;


      if (format) filter.format = format;
      if (disciplines?.length > 0) filter.disciplines = { $in: Array.isArray(disciplines) ? disciplines : [disciplines] };
      if (languages?.length > 0) filter.languages = { $in: Array.isArray(languages) ? languages : [languages] };
      if (eventType) filter.eventType = eventType;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { "address.street": { $regex: search, $options: 'i' } },
          { "address.city": { $regex: search, $options: 'i' } },
          { "address.state": { $regex: search, $options: 'i' } },
          { "address.venue": { $regex: search, $options: 'i' } },
          { "address.parkingDetails": { $regex: search, $options: 'i' } },
          { "address.parkingInstructions": { $regex: search, $options: 'i' } }
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
          filter.endDate = { $lte: endDate };
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
            filter['ticketTiers.price'] = { $lte: 0 };
            break;
          case 'low':
            filter['ticketTiers.price'] = { $gte: 0.01, $lte: 50 };
            break;
          case 'medium':
            filter['ticketTiers.price'] = { $gte: 50.01, $lte: 200 };
            break;
          case 'high':
            filter['ticketTiers.price'] = { $gte: 200.01 };
            break;
        }
      }

      // Duration filtering
      if (duration) {
        filter.duration = duration;
      }

      // Time of day filtering
      if (timeOfDay) {
        filter.timeOfDay = timeOfDay;
      }

      // Accessibility features filtering
      if (accessibilityFeatures && accessibilityFeatures.length > 0) {
        filter.accessibilityFeatures = { $in: Array.isArray(accessibilityFeatures) ? accessibilityFeatures : [accessibilityFeatures] };
      }

      // Inclusivity features filtering
      if (inclusivityFeatures && inclusivityFeatures.length > 0) {
        filter.inclusivityFeatures = { $in: Array.isArray(inclusivityFeatures) ? inclusivityFeatures : [inclusivityFeatures] };
      }

      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    const events = await EventModel.find(filter)
      .limit(limit)
      .skip(skip)
      .sort(sortObj);

    return createResponse(200, { events, count: events.length });
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
