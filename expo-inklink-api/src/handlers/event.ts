import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { createResponse, errorResponse } from "../utils/response";

interface EventFilters {
  format: string | null;
  disciplines: string[];
  access: string | null;
  eventType: string | null;
  search: string;
  dateRange: string | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface MongoFilter {
  format?: string;
  disciplines?: { $in: string[] };
  access?: string;
  eventType?: string;
  $or?: {
    title?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
    "address.street"?: { $regex: string; $options: string };
    "address.city"?: { $regex: string; $options: string };
    "address.state"?: { $regex: string; $options: string };
    "address.venue"?: { $regex: string; $options: string };
  }[];
  startDate?: { $gte: Date; $lt?: Date };
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

    const filter: MongoFilter = {};
    const sortObj: Record<string, 1 | -1> = {
      startDate: 1
    };

    if (queryStringParameters) {
      const {
        format = null,
        disciplines = [],
        access = null,
        eventType = null,
        search = '',
        dateRange = null,
        sortBy = 'startDate',
        sortOrder = 'asc'
      } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & EventFilters;


      if (format) filter.format = format;
      if (disciplines?.length > 0) filter.disciplines = { $in: Array.isArray(disciplines) ? disciplines : [disciplines] };
      if (access) filter.access = access;
      if (eventType) filter.eventType = eventType;
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { "address.street": { $regex: search, $options: 'i' } },
          { "address.city": { $regex: search, $options: 'i' } },
          { "address.state": { $regex: search, $options: 'i' } },
          { "address.venue": { $regex: search, $options: 'i' } }
        ];
      }
      if (dateRange) {
        if (dateRange === 'future') {
          filter.startDate = { $gte: new Date() };
        } else if (dateRange === 'today') {
          // From now to midnight today
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filter.startDate = { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
        } else if (dateRange === 'tomorrow') {
          // From tomorrow morning to midnight tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          filter.startDate = { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000) };
        } else if (dateRange === 'thisWeek') {
          // Now to next Sunday 
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextSunday = new Date();
          nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
          filter.startDate = { $gte: today, $lt: nextSunday };
        } else if (dateRange === 'thisWeekend') {
          // Only upcoming saturday and sunday
          const nextSaturday = new Date();
          nextSaturday.setDate(nextSaturday.getDate() + (6 - nextSaturday.getDay()));
          const nextSunday = new Date();
          nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
          filter.startDate = { $gte: nextSaturday, $lt: nextSunday };
        } else if (dateRange === 'thisMonth') {
          // Today to end of month
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          endOfMonth.setHours(23, 59, 59, 999);
          filter.startDate = { $gte: today, $lt: endOfMonth };
        }
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
