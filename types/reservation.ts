import type { BookInstance } from "./book";

export interface Reservation {
    id: string;
    instanceId: string;
    instance: BookInstance;
    userId: string;
    createdAt: string;
    expireAt: string;
}
