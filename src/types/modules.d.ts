declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: { workerSrc: string }
  export function getDocument(src: any): { promise: Promise<any> }
  export const version: string
}

declare module 'pdfjs-dist/build/pdf' {
  export * from 'pdfjs-dist'
}

declare module '@tanstack/react-query' {
  export const QueryClient: any
  export const QueryClientProvider: any
  export function useQuery(options: any): any
  export function useMutation(options: any): any
  export function useQueryClient(): any
  export function useInfiniteQuery(options: any): any
}
