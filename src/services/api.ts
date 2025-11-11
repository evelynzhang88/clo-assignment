import type { ContentItem, PricingOption } from '../types/content'

const API_URL = 'https://closet-recruiting-api.azurewebsites.net/api/data'

// API response interface based on actual API structure
interface ApiResponseItem {
  id: string
  creator: string
  title: string
  pricingOption: number // 0 = Paid, 1 = Free, 2 = View Only
  imagePath: string
  price: number
}

// Map pricing option enum from API to our PricingOption type
const PRICING_OPTION_MAP: Record<number, PricingOption> = {
  0: 'Paid',
  1: 'Free',
  2: 'View Only',
}

export const fetchContent = async (): Promise<ContentItem[]> => {
  try {
    const response = await fetch(API_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status} ${response.statusText}`)
    }
    
    const data: ApiResponseItem[] = await response.json()
    
    // Transform API response to ContentItem format
    return data.map((item: ApiResponseItem) => {
      const pricingOption = PRICING_OPTION_MAP[item.pricingOption] || 'Free'
      
      return {
        id: item.id,
        photo: item.imagePath,
        userName: item.creator,
        title: item.title,
        pricingOption: pricingOption as PricingOption,
        // Only include price for Paid items
        price: pricingOption === 'Paid' ? item.price : undefined,
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
}

