import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const jsonServerApi = createApi({
  reducerPath: "jsonServerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://65a7069694c2c5762da6290b.mockapi.io/api/v1/",
  }),
  tagTypes: ["Tasks"],
  endpoints: () => ({}),
})
