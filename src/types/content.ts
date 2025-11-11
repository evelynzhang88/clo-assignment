export type PricingOption = 'Paid' | 'Free' | 'View Only'

export type SortOption = 'Relevance' | 'Item Name' | 'Higher Price' | 'Lower Price'

export interface ContentItem {
  id: string
  photo: string
  userName: string
  title: string
  pricingOption: PricingOption
  price?: number
}

export interface PriceRange {
  min: number
  max: number
}

export interface ContentFilters {
  pricingOptions: PricingOption[]
  keyword: string
  sortBy: SortOption
  priceRange: PriceRange
}

