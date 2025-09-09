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
});


