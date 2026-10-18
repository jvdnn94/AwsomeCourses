import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import  { QueryClient , QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // داده‌ها تا ۵ دقیقه "تازه" محسوب می‌شوند
      refetchOnWindowFocus: false, // با تغییر تب مرورگر، خودکار رفرش نکند
      retry: 1, // در صورت خطا، فقط ۱ بار تلاش مجدد کند
    },
  },
});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <QueryClientProvider client={queryClient}>
    <App />
     <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
