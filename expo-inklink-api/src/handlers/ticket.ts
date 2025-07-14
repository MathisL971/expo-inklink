import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { TicketModel } from "../schemas/ticket";
import { createResponse, errorResponse } from "../utils/response";

interface TicketFilters {
    userId: string | null;
    eventId: string | null;
    status: string | null;
    paymentStatus: string | null;
    startDate: string | null;
    endDate: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface MongoTicketFilter {
    userId?: string;
    eventId?: string;
    status?: string;
    paymentStatus?: string;
    purchaseDate?: { $gte?: Date; $lte?: Date };
}

export async function handleTicketsGET(event: APIGatewayProxyEventV2) {
    const { pathParameters, queryStringParameters } = event;
    const ticketId = pathParameters?.id;

    if (ticketId) {
        // Get single ticket
        const singleTicket = await TicketModel.findById(ticketId)
            .populate('eventId', 'title startDate endDate') // Populate event details
            .exec();

        if (!singleTicket) {
            return errorResponse(404, "Ticket not found");
        }
        return createResponse(200, singleTicket);
    } else {
        // Get tickets with optional query parameters
        const limit = queryStringParameters?.limit
            ? parseInt(queryStringParameters.limit)
            : 20;

        const skip = queryStringParameters?.skip
            ? parseInt(queryStringParameters.skip)
            : 0;

        const filter: MongoTicketFilter = {};
        const sortObj: Record<string, 1 | -1> = {
            purchaseDate: -1 // Default to newest tickets first
        };

        if (queryStringParameters) {
            const {
                userId = null,
                eventId = null,
                status = null,
                paymentStatus = null,
                startDate = null,
                endDate = null,
                sortBy = 'purchaseDate',
                sortOrder = 'desc'
            } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & TicketFilters;

            // Apply filters
            if (userId) filter.userId = userId;
            if (eventId) filter.eventId = eventId;
            if (status) filter.status = status;
            if (paymentStatus) filter.paymentStatus = paymentStatus;

            // Date filtering for purchase date
            if (startDate) {
                const start = new Date(startDate);
                if (!isNaN(start.getTime())) {
                    filter.purchaseDate = { ...filter.purchaseDate, $gte: start };
                }
            }

            if (endDate) {
                const end = new Date(endDate);
                if (!isNaN(end.getTime())) {
                    filter.purchaseDate = { ...filter.purchaseDate, $lte: end };
                }
            }

            // Sorting
            sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Get total count
        const totalCount = await TicketModel.countDocuments(filter);

        // Get tickets with event details populated
        const tickets = await TicketModel.find(filter)
            .populate('eventId', 'title startDate endDate eventType address.venue') // Populate essential event details
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .exec();

        return createResponse(200, {
            tickets,
            count: tickets.length,
            totalCount: totalCount
        });
    }
}

export async function handleTicketsPOST(event: APIGatewayProxyEventV2) {
    try {
        const ticketData = JSON.parse(event.body || "{}");

        // Validate that the event exists and has available tickets
        if (ticketData.eventId) {
            const eventExists = await EventModel.findById(ticketData.eventId);
            if (!eventExists) {
                return errorResponse(400, "Event not found");
            }

            // Check if the event has available tickets
            if (eventExists.availableTickets < (ticketData.quantity || 1)) {
                return errorResponse(400, "Not enough available tickets for this event");
            }

            // Validate ticket tier exists in the event
            if (ticketData.ticketTierId) {
                const ticketTierExists = eventExists.ticketTiers?.some(
                    tier => tier._id?.toString() === ticketData.ticketTierId
                );
                if (!ticketTierExists) {
                    return errorResponse(400, "Invalid ticket tier for this event");
                }
            }
        }

        // Create the ticket
        const newTicket = new TicketModel(ticketData);
        const savedTicket = await newTicket.save();

        // Update event ticket availability
        if (ticketData.eventId && ticketData.quantity) {
            await EventModel.findByIdAndUpdate(
                ticketData.eventId,
                {
                    $inc: {
                        availableTickets: -ticketData.quantity
                    }
                }
            );
        }

        // Populate event details in response
        const populatedTicket = await TicketModel.findById(savedTicket._id)
            .populate('eventId', 'title startDate endDate')
            .exec();

        return createResponse(201, populatedTicket);
    } catch (error: any) {
        if (error.name === "ValidationError") {
            return errorResponse(400, "Validation error", error);
        }
        throw error;
    }
}

export async function handleTicketsPUT(event: APIGatewayProxyEventV2) {
    const ticketId = event.pathParameters?.id;
    if (!ticketId) {
        return errorResponse(400, "Ticket ID is required for PUT requests");
    }

    try {
        const ticketData = JSON.parse(event.body || "{}");

        // Get the original ticket to check for quantity changes
        const originalTicket = await TicketModel.findById(ticketId);
        if (!originalTicket) {
            return errorResponse(404, "Ticket not found");
        }

        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketId,
            ticketData,
            { new: true, runValidators: true }
        ).populate('eventId', 'title startDate endDate').exec();

        if (!updatedTicket) {
            return errorResponse(404, "Ticket not found");
        }

        // Handle quantity changes if applicable
        if (ticketData.quantity && ticketData.quantity !== originalTicket.quantity) {
            const quantityDifference = originalTicket.quantity - ticketData.quantity;
            await EventModel.findByIdAndUpdate(
                originalTicket.eventId,
                {
                    $inc: {
                        availableTickets: quantityDifference
                    }
                }
            );
        }

        return createResponse(200, updatedTicket);
    } catch (error: any) {
        if (error.name === "ValidationError") {
            return errorResponse(400, "Validation error", error);
        }
        throw error;
    }
}

export async function handleTicketsDELETE(event: APIGatewayProxyEventV2) {
    const ticketId = event.pathParameters?.id;
    if (!ticketId) {
        return errorResponse(400, "Ticket ID is required for DELETE requests");
    }

    // Get the ticket first to restore event availability
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
        return errorResponse(404, "Ticket not found");
    }

    // Delete the ticket
    const deletedTicket = await TicketModel.findByIdAndDelete(ticketId);

    // Restore event ticket availability
    if (ticket.eventId && ticket.quantity) {
        await EventModel.findByIdAndUpdate(
            ticket.eventId,
            {
                $inc: {
                    availableTickets: ticket.quantity
                }
            }
        );
    }

    return createResponse(200, {
        message: "Ticket deleted successfully",
        id: ticketId,
    });
} 