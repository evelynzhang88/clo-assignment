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
    sortBy: 'Relevance',
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
        sortBy: 'Relevance',
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
      let filtered = [...state.items]

      // Apply pricing filter
      if (state.filters.pricingOptions.length > 0) {
        filtered = filtered.filter((item) =>
          state.filters.pricingOptions.includes(item.pricingOption)
        )
      }

      // Apply keyword filter
      if (state.filters.keyword.trim()) {
        const keyword = state.filters.keyword.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.userName.toLowerCase().includes(keyword) ||
            item.title.toLowerCase().includes(keyword)
        )
      }

      // Apply price range filter (only for Paid items)
      if (state.filters.pricingOptions.includes('Paid')) {
        filtered = filtered.filter((item) => {
          if (item.pricingOption === 'Paid' && item.price !== undefined) {
            return (
              item.price >= state.filters.priceRange.min &&
              item.price <= state.filters.priceRange.max
            )
          }
          // Non-Paid items pass through
          return item.pricingOption !== 'Paid'
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (state.filters.sortBy) {
          case 'Higher Price':
            const priceA = a.price ?? 0
            const priceB = b.price ?? 0
            return priceB - priceA
          case 'Lower Price':
            const priceA2 = a.price ?? 0
            const priceB2 = b.price ?? 0
            return priceA2 - priceB2
          case 'Item Name':
            return a.title.localeCompare(b.title)
          case 'Relevance':
          default:
            // Relevance keeps original order (no sorting)
            return 0
        }
      })

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
        state.filteredItems = action.payload
        state.displayedItems = action.payload.slice(0, state.chunkSize)
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

