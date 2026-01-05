import { Event } from "@core/models/event.model";

export interface EventDetails{
    event: Event[],
    recommended: Event[]
}