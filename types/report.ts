import type {Reservation} from "~/types/reservation";

export type ReportType = {
    id: string
    reservation: Reservation
    text: string
}