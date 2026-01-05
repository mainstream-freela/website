import { Advertiser } from "./advertiser.model"
import { Category } from "./category.model"
import { Location } from "./location.model"
import { Tag } from "./tags.model"
import { Ticket } from "./ticket.model"

export interface Event{
    uuid: string
    title: string,
    slug: string,
    description: string,
    date: string,
    time: string,
    formatted_date: string,
    duration: string,
    duration_unit: string,
    formatted_duration: string,
    is_highlighted: boolean,
    status: string,
    image: string,
    location: Location,
    category: Category,
    tags: Tag[],
    tickets: Ticket[],
    advertiser: Advertiser
}

export interface PaginatedEventResponse{
    data: Event[],
    current_page: number,
    first_page_url: string,
    from: number,
    to: number,
    last_page: number,
    last_page_url: string,
    links: PaginationLink[],
    next_page_url: string | null,
    total: number,
    path: string,
    per_page: number,
    prev_page_url: string | null,
}

interface PaginationLink{
    url: string,
    label: string,
    active: boolean
}