import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { createResponse, errorResponse } from "../utils/response";

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

    const events = await EventModel.find({})
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

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
