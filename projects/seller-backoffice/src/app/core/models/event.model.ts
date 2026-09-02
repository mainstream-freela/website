
export interface BaseLocation{
    name: string,
    slug: string
}

export interface BaseEvent{
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
    has_live_streaming: boolean,
    location: BaseLocation,
    live?: {
        is_live: boolean;
        started_at: string | null;
        ended_at: string | null;
    }
}