import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export interface Book {
  id: string
  createdAt: string
  updatedAt: string
  createdUserId: string | null
  updatedUserId: string | null
  name: string
  authorName: string
}

interface CreateBookData {
  name: string
  authorName: string
}

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:4500/api' }),
  tagTypes: ['Book'],
  endpoints: builder => ({
    getBooks: builder.query<Book[], void>({
      query: () => '/books',
      providesTags: ['Book']
    }),
    getBook: builder.query<Book, string>({
      query: id => `/books/${id}`,
      providesTags: ['Book']
    }),
    createBook: builder.mutation<Book, CreateBookData>({
      query: data => ({
        url: '/books',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Book']
    }),
    deleteBook: builder.mutation<void, string>({
      query: id => ({
        url: `/books/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Book']
    })
  })
})

export const { useGetBooksQuery, useGetBookQuery, useCreateBookMutation, useDeleteBookMutation } =
  booksApi
