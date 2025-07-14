import axios from "axios";
import { PaymentMethod, Ticket, TicketFilters } from "../types/index";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function fetchTickets(): Promise<{
    tickets: Ticket[];
    count: number;
    totalCount: number;
}> {
    const res = await axios.get(`${baseUrl}/tickets`);
    return res.data;
}

export async function fetchTicketsWithFilters(filters: TicketFilters): Promise<{
    tickets: Ticket[];
    count: number;
    totalCount: number;
}> {
    const queryParams = new URLSearchParams();

    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.eventId) queryParams.append('eventId', filters.eventId);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.paymentStatus) queryParams.append('paymentStatus', filters.paymentStatus);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    const res = await axios.get(`${baseUrl}/tickets?${queryParams.toString()}`);
    return res.data;
}

export async function fetchTicket(id: string): Promise<Ticket> {
    const res = await axios.get(`${baseUrl}/tickets/${id}`);
    return res.data;
}

export async function fetchUserTickets(userId: string): Promise<{
    tickets: Ticket[];
    count: number;
    totalCount: number;
}> {
    return fetchTicketsWithFilters({ userId });
}

export async function fetchEventTickets(eventId: string): Promise<{
    tickets: Ticket[];
    count: number;
    totalCount: number;
}> {
    return fetchTicketsWithFilters({ eventId });
}

export async function createTicket(ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Promise<Ticket> {
    const res = await axios.post(`${baseUrl}/tickets`, ticket);
    return res.data;
}

export async function updateTicket(ticket: Ticket): Promise<Ticket> {
    const res = await axios.put(`${baseUrl}/tickets/${ticket.id}`, ticket);
    return res.data;
}

export async function deleteTicket(id: string): Promise<void> {
    await axios.delete(`${baseUrl}/tickets/${id}`);
}

// Helper function to purchase a ticket for an event
export async function purchaseTicket(
    eventId: string,
    userId: string,
    ticketTierId: string,
    quantity: number = 1,
    unitPrice: number,
    paymentMethod?: PaymentMethod,
    paymentTransactionId?: string,
    contactEmail?: string,
    contactPhone?: string
): Promise<Ticket> {
    const ticketData = {
        eventId,
        userId,
        ticketTierId,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        status: "purchased" as const,
        paymentStatus: "completed" as const,
        purchaseDate: new Date().toISOString(),
        paymentMethod,
        paymentTransactionId,
        contactEmail,
        contactPhone
    };

    return createTicket(ticketData);
}

// Helper function to cancel a ticket
export async function cancelTicket(ticketId: string, reason?: string): Promise<Ticket> {
    const ticket = await fetchTicket(ticketId);
    const updatedTicket = {
        ...ticket,
        status: "cancelled" as const,
        notes: reason ? `Cancelled: ${reason}` : "Cancelled by user"
    };
    return updateTicket(updatedTicket);
}

// Helper function to check in a ticket
export async function checkInTicket(ticketId: string): Promise<Ticket> {
    const ticket = await fetchTicket(ticketId);
    const updatedTicket = {
        ...ticket,
        status: "used" as const,
        checkInDate: new Date().toISOString()
    };
    return updateTicket(updatedTicket);
} 