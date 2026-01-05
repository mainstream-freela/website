import { Event } from "@core/models/event.model";
import { Ticket } from "@core/models/ticket.model";

export interface CheckoutContract{
    event: Event,
    ticket: Ticket,
    quantity: number,
}