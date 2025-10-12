import type { ApiBuilder } from "@/types/typesAll";

export interface Motorcycle {
  id: number;
  brand: string;
  model: string;
  year: number;
  category: string;
  engine_volume: number;
  power: number;
  fuel_type: string;
  transmission: string;
  weight: number;
  daily_price: string | number;
  is_available: boolean;
  description: string;
  min_rental_hours: number;
  min_rental_days: number;
  photos?: { image: string }[];
  owner_email?: string;
}

export const catalogApi = (builder: ApiBuilder) => ({
  getMotorcycles: builder.query<Motorcycle[], void>({
    query: () => ({ url: "/api/motorcycles" }),
    providesTags: ["Space"],
  }),
  getMotorcycleById: builder.query<Motorcycle, number | string>({
    query: (id) => ({ url: `/api/motorcycles/${id}` }),
    providesTags: ["Space"],
  }),
  getMyMotorcycles: builder.query<Motorcycle[], void>({
    query: () => ({ url: "/api/my-motorcycles" }),
    providesTags: ["Space"],
  }),
  createMotorcycle: builder.mutation<
    Motorcycle,
    FormData | Partial<Motorcycle>
  >({
    query: (data) => ({
      url: "/api/my-motorcycles",
      method: "POST",
      body: data,
    }),
    invalidatesTags: ["Space"],
  }),
  updateMotorcycle: builder.mutation<
    Motorcycle,
    { id: number; data: Partial<Motorcycle> }
  >({
    query: ({ id, data }) => ({
      url: `/api/my-motorcycles/${id}`,
      method: "PATCH",
      body: data,
    }),
    invalidatesTags: ["Space"],
  }),
  deleteMotorcycle: builder.mutation<void, number>({
    query: (id) => ({
      url: `/api/my-motorcycles/${id}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Space"],
  }),
  toggleMotorcyclePublic: builder.mutation<
    { message: string; is_public: boolean },
    number
  >({
    query: (id) => ({
      url: `/api/my-motorcycles/${id}/toggle_public`,
      method: "POST",
    }),
    invalidatesTags: ["Space"],
  }),
  unpublishMotorcycle: builder.mutation<{ message: string }, number>({
    query: (id) => ({
      url: `/api/motorcycles/${id}/unpublish`,
      method: "POST",
    }),
    invalidatesTags: ["Space"],
  }),
});
