import { configureStore } from '@reduxjs/toolkit'

import { booksApi } from '@/store/api/books-api'
import themeReducer from '@/store/ui/themeSlice'

export const store = configureStore({
  reducer: {
    [booksApi.reducerPath]: booksApi.reducer,
    theme: themeReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(booksApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
