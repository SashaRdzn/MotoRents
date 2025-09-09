import type { ApiBuilder } from "@/types/typesAll";

export interface RentalPeriodPayload {
  start_time: string; // ISO
  end_time: string;   // ISO
}

export type BookingType = 'hourly' | 'daily';

export interface BookingCreatePayload {
  motorcycle: number;
  rental_period: RentalPeriodPayload;
  booking_type: BookingType;
}

export interface BookingItem {
  id: number;
  motorcycle: any;
  rental_period: { start_time: string; end_time: string };
  booking_type: BookingType;
  total_price: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export const bookingApi = (builder: ApiBuilder) => ({
  createBooking: builder.mutation<BookingItem, BookingCreatePayload>({
    query: (body) => ({ url: '/api/bookings', method: 'POST', body }),
    invalidatesTags: ['Auth'],
  }),
  getMyBookings: builder.query<BookingItem[], void>({
    query: () => ({ url: '/api/bookings' }),
    providesTags: ['Auth'],
  }),
  cancelBooking: builder.mutation<void, number>({
    query: (id) => ({ url: `/api/bookings/${id}`, method: 'DELETE' }),
    invalidatesTags: ['Auth'],
  }),
});


