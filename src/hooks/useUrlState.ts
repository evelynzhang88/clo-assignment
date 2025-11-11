import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters, resetFilters } from '../store/slices/contentSlice'
import type { PricingOption, SortOption } from '../types/content'

export function useUrlState() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.content.filters)

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const pricingOptionsParam = params.get('pricing')
    const keywordParam = params.get('keyword')
    const sortByParam = params.get('sortBy')
    const priceMinParam = params.get('priceMin')
    const priceMaxParam = params.get('priceMax')

    const pricingOptions: PricingOption[] = pricingOptionsParam
      ? (pricingOptionsParam.split(',') as PricingOption[])
      : []

    const keyword = keywordParam || ''
    const sortBy = (sortByParam as SortOption) || 'Relevance'
    const priceRange = {
      min: priceMinParam ? parseInt(priceMinParam, 10) : 0,
      max: priceMaxParam ? parseInt(priceMaxParam, 10) : 999,
    }

    if (
      pricingOptions.length > 0 ||
      keyword ||
      sortBy !== 'Item Name' ||
      priceRange.min !== 0 ||
      priceRange.max !== 999
    ) {
      dispatch(setFilters({ pricingOptions, keyword, sortBy, priceRange }))
    }
  }, [dispatch])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.pricingOptions.length > 0) {
      params.set('pricing', filters.pricingOptions.join(','))
    }

    if (filters.keyword.trim()) {
      params.set('keyword', filters.keyword)
    }

    if (filters.sortBy !== 'Relevance') {
      params.set('sortBy', filters.sortBy)
    }

    if (filters.priceRange.min !== 0) {
      params.set('priceMin', filters.priceRange.min.toString())
    }

    if (filters.priceRange.max !== 999) {
      params.set('priceMax', filters.priceRange.max.toString())
    }

    const newUrl =
      params.toString() === ''
        ? window.location.pathname
        : `${window.location.pathname}?${params.toString()}`

    window.history.replaceState({}, '', newUrl)
  }, [filters])
}

