import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { ContentItem, ContentFilters, PricingOption } from '../../types/content'
import { fetchContent } from '../../services/api'

interface ContentState {
  items: ContentItem[]
  filteredItems: ContentItem[]
  displayedItems: ContentItem[]
  filters: ContentFilters
  isLoading: boolean
  error: string | null
  chunkSize: number
  currentChunk: number
}

const initialState: ContentState = {
  items: [],
  filteredItems: [],
  displayedItems: [],
  filters: {
    pricingOptions: [],
    keyword: '',
    sortBy: 'Item Name',
    priceRange: { min: 0, max: 999 },
  },
  isLoading: false,
  error: null,
  chunkSize: 12,
  currentChunk: 1,
}

export const loadContent = createAsyncThunk(
  'content/loadContent',
  async () => {
    const data = await fetchContent()
    return data
  }
)

// Helper function to apply filters to items
function applyFiltersToItems(items: ContentItem[], filters: ContentFilters): ContentItem[] {
  let filtered = [...items]

  // Apply pricing filter
  if (filters.pricingOptions.length > 0) {
    filtered = filtered.filter((item) =>
      filters.pricingOptions.includes(item.pricingOption)
    )
  }

  // Apply keyword filter
  if (filters.keyword.trim()) {
    const keyword = filters.keyword.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.userName.toLowerCase().includes(keyword) ||
        item.title.toLowerCase().includes(keyword)
    )
  }

  // Apply price range filter (only for Paid items)
  if (filters.pricingOptions.includes('Paid')) {
    filtered = filtered.filter((item) => {
      if (item.pricingOption === 'Paid' && item.price !== undefined) {
        return (
          item.price >= filters.priceRange.min &&
          item.price <= filters.priceRange.max
        )
      }
      // Non-Paid items pass through
      return item.pricingOption !== 'Paid'
    })
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'Higher Price':
        const priceA = a.price ?? 0
        const priceB = b.price ?? 0
        return priceB - priceA
      case 'Lower Price':
        const priceA2 = a.price ?? 0
        const priceB2 = b.price ?? 0
        return priceA2 - priceB2
      case 'Item Name':
      default:
        return a.title.localeCompare(b.title)
    }
  })

  return filtered
}

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ContentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.currentChunk = 1
    },
    resetFilters: (state) => {
      state.filters = {
        pricingOptions: [],
        keyword: '',
        sortBy: 'Item Name',
        priceRange: { min: 0, max: 999 },
      }
      state.currentChunk = 1
    },
    loadMoreItems: (state) => {
      const nextChunk = state.currentChunk + 1
      const endIndex = nextChunk * state.chunkSize
      state.displayedItems = state.filteredItems.slice(0, endIndex)
      state.currentChunk = nextChunk
    },
    applyFilters: (state) => {
      const filtered = applyFiltersToItems(state.items, state.filters)
      state.filteredItems = filtered
      state.currentChunk = 1
      state.displayedItems = filtered.slice(0, state.chunkSize)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadContent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadContent.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        
        // Apply current filters to the newly loaded data
        const filtered = applyFiltersToItems(action.payload, state.filters)
        state.filteredItems = filtered
        state.currentChunk = 1
        state.displayedItems = filtered.slice(0, state.chunkSize)
      })
      .addCase(loadContent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to load content'
      })
  },
})

export const { setFilters, resetFilters, loadMoreItems, applyFilters } =
  contentSlice.actions
export default contentSlice.reducer

