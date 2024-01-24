import { configureStore } from "@reduxjs/toolkit"
import { jsonServerApi } from "../api/apiSlice"
import { setupListeners } from "@reduxjs/toolkit/query"

export const store = configureStore({
  reducer: {
    [jsonServerApi.reducerPath]: jsonServerApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(jsonServerApi.middleware),
  devTools: true,
})

setupListeners(store.dispatch)

export default store
