import { defineStore } from "pinia";
import { useAuthCacheStore } from "./auth";
import type { Reservation } from "~/types/reservation";

export const useReservationsStore = defineStore(
    "Reservations",
    () => {
        const reservations = ref<Reservation[]>([]);
        const { user } = toRefs(useAuthCacheStore());
        const { $api } = useNuxtApp();

        const updateReservations = async () => {
            const data = await $api<Reservation[]>("/reservations");
            reservations.value = data;
        };

        watch(user, updateReservations);

        updateReservations();

        const reserveInstance = async (id: string) => {
            const result = await $api<Reservation>(`/reservations`, {
                method: "POST",
                body: {
                    instanceId: id,
                },
            });
            if (result) {
                reservations.value.push(result);
            }
            return result
        };

        const cancelReservation = async (id: string) => {
            const response = await $api<Reservation>(`/reservations/${id}`, {
                method: "DELETE"
            });
            const idx = reservations.value.findIndex((rv) => rv.id == id)
            if (idx != -1) {
                reservations.value.splice(idx, 1)
            }
        }

        const confirmReservation = async (id: string) => {
            const response = await $api<Reservation>(`/reservations/${id}/confirm`, {
                method: "POST"
            });
            const idx = reservations.value.findIndex((rv) => rv.id == id)
            if (idx != -1) {
                reservations.value.splice(idx, 1)
            }
        }

        return { reservations, reserveInstance, cancelReservation, confirmReservation };
    },
    {
        persist: {
            storage: piniaPluginPersistedstate.cookies({
                sameSite: "strict",
                maxAge: 172800,
            }),
        },
    }
);
