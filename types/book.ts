import type { Location } from "./location";
import type { User } from "./user";

export type InstanceStatus = "MODERATION" | "PLACED" | "RESERVED" | "RECIEVED";

export interface BookInstance {
    id: string;
    bookId: string;
    createdAt: string;
    condition: keyof typeof useConditionString;
    ownerId: string;
    owner: User;
    photoId: string;
    locationId: string;
    location: Location;
    description: string;
    status: InstanceStatus;
}

export type Book = {
    id: string;
    name: string;
    author: string;
    isbn: string;
    genre: string;
    editionYear: number;
    publishingCompany: string;
    language: string;
    cover: keyof typeof useCoverString;
    pages: number;
    size: keyof typeof useSizeString;
    coverId: string;
};
