export interface SearchResult {
  id: number
  type: 'product' | 'category' | 'supplier'
  title: string
  subtitle: string | null
  link: string
} 