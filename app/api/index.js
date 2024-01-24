import { jsonServerApi } from "./apiSlice"

export const tasksApi = jsonServerApi.injectEndpoints({
  endpoints: (builder) => ({
    tasks: builder.query({
      query: () => "/tasks",
      providesTags: ["Tasks"],
    }),
    createTask: builder.mutation({
      query: ({ _id, title }) => ({
        url: `/tasks`,
        method: "POST",
        body: { _id, checked: false, syncNumber: 0, title },
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
})

export const {
  useTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi
