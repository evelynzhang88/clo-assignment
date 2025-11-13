import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters, resetFilters } from '../store/slices/contentSlice'
import type { PricingOption, SortOption } from '../types/content'

export function useUrlState() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.content.filters)
  const hasLoadedFromUrl = useRef(false)
  const shouldSkipNextUrlUpdate = useRef(false)
  const initialUrlHasParams = useRef(window.location.search.length > 0)

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
    const sortBy = (sortByParam as SortOption) || 'Item Name'
    const priceRange = {
      min: priceMinParam ? parseInt(priceMinParam, 10) : 0,
      max: priceMaxParam ? parseInt(priceMaxParam, 10) : 999,
    }

    // Always dispatch to ensure state matches URL, even if values are defaults
    dispatch(setFilters({ pricingOptions, keyword, sortBy, priceRange }))
    hasLoadedFromUrl.current = true
    
    // If URL had params, skip the first URL update to prevent clearing them
    if (initialUrlHasParams.current) {
      shouldSkipNextUrlUpdate.current = true
    }
  }, [dispatch])

  // Update URL when filters change (but not on initial mount before URL is loaded)
  useEffect(() => {
    // Skip URL update during initial mount if URL had params (to prevent clearing them)
    if (!hasLoadedFromUrl.current) {
      return
    }

    // Skip the first update after loading from URL if URL originally had params
    if (shouldSkipNextUrlUpdate.current) {
      shouldSkipNextUrlUpdate.current = false
      return
    }

    const params = new URLSearchParams()

    if (filters.pricingOptions.length > 0) {
      params.set('pricing', filters.pricingOptions.join(','))
    }

    if (filters.keyword.trim()) {
      params.set('keyword', filters.keyword)
    }

    if (filters.sortBy !== 'Item Name') {
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

    // Only update URL if it's different from current URL to avoid unnecessary history entries
    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      window.history.replaceState({}, '', newUrl)
    }
  }, [filters])
}

