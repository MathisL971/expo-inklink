import { Reservation, TicketSelection } from "@/types";
import axios from "axios";

const baseUrl = "https://c2nxeiwa04.execute-api.us-east-2.amazonaws.com/api";

export async function createReservation({
    eventId,
    userId,
    tickets
}: {
    eventId: string;
    userId: string;
    tickets: TicketSelection[];
}): Promise<Reservation> {
    const res = await axios.post(`${baseUrl}/reservations`, {
        eventId,
        userId,
        tickets
    });
    return res.data;
}

export async function deleteReservation({
    reservationId
}: {
    reservationId: string;
}) {
    const res = await axios.delete(`${baseUrl}/reservations/${reservationId}`);
    return res.data;
}

export async function updateReservation({
    reservationId,
    status
}: {
    reservationId: string;
    status: string;
}) {
    const res = await axios.put(`${baseUrl}/reservations/${reservationId}`, { status });
    return res.data;
}