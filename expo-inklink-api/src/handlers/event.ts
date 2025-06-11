import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { createResponse, errorResponse } from "../utils/response";

interface EventFilters {
  format: string | null;
  disciplines: string[];
  access: string | null;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface MongoFilter {
  format?: string;
  disciplines?: { $in: string[] };
  access?: string;
  $or?: {
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    location?: { $regex: string; $options: string };
  }[];
}

export async function handleEventsGET(event: APIGatewayProxyEventV2) {
  const { pathParameters, queryStringParameters } = event;
  const eventId = pathParameters?.id;

  if (eventId) {
    // Get single event
    const singleEvent = await EventModel.findById(eventId);
    if (!singleEvent) {
      return errorResponse(404, "Event not found");
    }
    return createResponse(200, singleEvent);
  } else {
    // Get all events with optional query parameters
    const limit = queryStringParameters?.limit
      ? parseInt(queryStringParameters.limit)
      : 20;
      
    const skip = queryStringParameters?.skip
      ? parseInt(queryStringParameters.skip)
      : 0;
      
    const {
      format = null,
      disciplines = [],
      access = null,
      search = '',
      sortBy = 'startDate',
      sortOrder = 'asc'
    } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & EventFilters;

    const filter: MongoFilter = {};

    if (format) filter.format = format;
    if (disciplines?.length > 0) filter.disciplines = { $in: Array.isArray(disciplines) ? disciplines : [disciplines] };
    if (access) filter.access = access;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

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
