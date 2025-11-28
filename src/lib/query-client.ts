import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      staleTime: 1000 * 30, // fresh for 30s
      retry: 1,
      gcTime: 1000 * 60 * 5, // garbage collected after 5 minutes
    },
  },
})

