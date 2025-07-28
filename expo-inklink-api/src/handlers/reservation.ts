import type { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2 } from "aws-lambda";
import { EventModel } from "../schemas/event";
import { ReservationModel } from "../schemas/reservation";
import { createResponse, errorResponse } from "../utils/response";

interface ReservationFilters {
    userId: string | null;
    eventId: string | null;
    expired: string | null;
    status: string | null;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface MongoReservationFilter {
    userId?: string;
    eventId?: string;
    expiresAt?: { $gt?: Date; $lt?: Date };
    status?: string;
}

export async function handleReservationsGET(event: APIGatewayProxyEventV2) {
    const { pathParameters, queryStringParameters } = event;
    const reservationId = pathParameters?.id;

    if (reservationId) {
        // Get single reservation
        const singleReservation = await ReservationModel.findById(reservationId)
            .populate('eventId', 'title startDate endDate ticketTiers') // Populate event details
            .exec();

        if (!singleReservation) {
            return errorResponse(404, "Reservation not found");
        }
        return createResponse(200, singleReservation);
    } else {
        // Get reservations with optional query parameters
        const limit = queryStringParameters?.limit
            ? parseInt(queryStringParameters.limit)
            : 20;

        const skip = queryStringParameters?.skip
            ? parseInt(queryStringParameters.skip)
            : 0;

        const filter: MongoReservationFilter = {};
        const sortObj: Record<string, 1 | -1> = {
            createdAt: -1 // Default to newest reservations first
        };

        if (queryStringParameters) {
            const {
                userId = null,
                eventId = null,
                expired = null,
                status = null,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = queryStringParameters as APIGatewayProxyEventQueryStringParameters & ReservationFilters;

            // Apply filters
            if (userId) filter.userId = userId;
            if (eventId) filter.eventId = eventId;
            if (status) filter.status = status;

            // Filter by expiration status
            if (expired === 'true') {
                filter.expiresAt = { $lt: new Date() };
            } else if (expired === 'false') {
                filter.expiresAt = { $gt: new Date() };
            }

            // Sorting
            sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
        }

        // Get total count
        const totalCount = await ReservationModel.countDocuments(filter);

        // Get reservations with event details populated
        const reservations = await ReservationModel.find(filter)
            .populate('eventId', 'title startDate endDate eventType address.venue ticketTiers') // Populate essential event details
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .exec();

        return createResponse(200, {
            reservations,
            count: reservations.length,
            totalCount: totalCount
        });
    }
}

export async function handleReservationsPOST(event: APIGatewayProxyEventV2) {
    try {
        const reservationData = JSON.parse(event.body || "{}");

        // Validate that the event exists
        if (reservationData.eventId) {
            const eventExists = await EventModel.findById(reservationData.eventId);
            if (!eventExists) {
                return errorResponse(400, "Event not found");
            }

            // Validate that all ticket tiers exist in the event
            if (reservationData.tickets && Array.isArray(reservationData.tickets)) {
                for (const ticketSelection of reservationData.tickets) {
                    const ticketTierExists = eventExists.ticketTiers?.some(
                        tier => tier._id?.toString() === ticketSelection.tierId
                    );
                    if (!ticketTierExists) {
                        return errorResponse(400, `Invalid ticket tier: ${ticketSelection.tierId}`);
                    }

                    // Validate that there are enough available tickets
                    const ticketTier = eventExists.ticketTiers?.find(
                        tier => tier._id?.toString() === ticketSelection.tierId
                    );
                    if (ticketTier && ticketTier.available < ticketSelection.quantity) {
                        return errorResponse(400, `Not enough available tickets for tier: ${ticketSelection.name}`);
                    }
                }
            }
        }

        // Set default expiration (15 minutes from now) if not provided
        if (!reservationData.expiresAt) {
            const expirationTime = new Date();
            expirationTime.setMinutes(expirationTime.getMinutes() + 5);
            reservationData.expiresAt = expirationTime;
        }

        // Create the reservation
        const newReservation = new ReservationModel(reservationData);
        const savedReservation = await newReservation.save();

        // Update ticket tier availability
        if (reservationData.eventId && reservationData.tickets) {
            for (const ticketSelection of reservationData.tickets) {
                await EventModel.updateOne(
                    { 
                        _id: reservationData.eventId,
                        "ticketTiers._id": ticketSelection.tierId
                    },
                    {
                        $inc: {
                            "ticketTiers.$.available": -ticketSelection.quantity,
                            availableTickets: -ticketSelection.quantity
                        }
                    }
                );
            }
        }

        // Populate event details in response
        const populatedReservation = await ReservationModel.findById(savedReservation._id)
            .populate('eventId', 'title startDate endDate ticketTiers')
            .exec();

        return createResponse(201, populatedReservation);
    } catch (error: any) {
        if (error.name === "ValidationError") {
            return errorResponse(400, "Validation error", error);
        }
        throw error;
    }
}

export async function handleReservationsPUT(event: APIGatewayProxyEventV2) {
    const reservationId = event.pathParameters?.id;
    if (!reservationId) {
        return errorResponse(400, "Reservation ID is required for PUT requests");
    }

    try {
        const reservationData = JSON.parse(event.body || "{}");

        // Get the original reservation
        const originalReservation = await ReservationModel.findById(reservationId);
        if (!originalReservation) {
            return errorResponse(404, "Reservation not found");
        }

        // Check if reservation has expired
        if (originalReservation.expiresAt && originalReservation.expiresAt < new Date()) {
            return errorResponse(400, "Cannot update expired reservation");
        }

        const updatedReservation = await ReservationModel.findByIdAndUpdate(
            reservationId,
            reservationData,
            { new: true, runValidators: true }
        ).populate('eventId', 'title startDate endDate ticketTiers').exec();

        if (!updatedReservation) {
            return errorResponse(404, "Reservation not found");
        }

        // If ticket quantities changed, we would need to adjust event availability
        // For simplicity, we'll require deleting and creating new reservations for quantity changes
        // This could be enhanced to handle quantity updates

        return createResponse(200, updatedReservation);
    } catch (error: any) {
        if (error.name === "ValidationError") {
            return errorResponse(400, "Validation error", error);
        }
        throw error;
    }
}

export async function handleReservationsDELETE(event: APIGatewayProxyEventV2) {
    const reservationId = event.pathParameters?.id;
    if (!reservationId) {
        return errorResponse(400, "Reservation ID is required for DELETE requests");
    }

    // Get the reservation first to restore event availability
    const reservation = await ReservationModel.findById(reservationId);
    if (!reservation) {
        return errorResponse(404, "Reservation not found");
    }

    // Delete the reservation
    await ReservationModel.findByIdAndDelete(reservationId);

    // Restore event ticket tier availability
    if (reservation.eventId && reservation.tickets) {
        for (const ticketSelection of reservation.tickets) {
            await EventModel.updateOne(
                { 
                    _id: reservation.eventId,
                    "ticketTiers._id": ticketSelection.tierId
                },
                {
                    $inc: {
                        "ticketTiers.$.available": ticketSelection.quantity,
                        availableTickets: ticketSelection.quantity
                    }
                }
            );
        }
    }

    return createResponse(200, {
        message: "Reservation deleted successfully",
        id: reservationId,
    });
}
