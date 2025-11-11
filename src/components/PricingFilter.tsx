import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters, resetFilters } from '../store/slices/contentSlice'
import type { PricingOption } from '../types/content'
import './PricingFilter.scss'

const PRICING_OPTIONS: PricingOption[] = ['Paid', 'Free', 'View Only']

export default function PricingFilter() {
  const dispatch = useAppDispatch()
  const selectedOptions = useAppSelector(
    (state) => state.content.filters.pricingOptions
  )

  const handleOptionChange = (option: PricingOption) => {
    const newOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option]
    
    dispatch(setFilters({ pricingOptions: newOptions }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <div className="pricing-filter">
      <h3>Pricing Option</h3>
      <div className="pricing-options">
        {PRICING_OPTIONS.map((option) => (
          <label key={option} className="pricing-option">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionChange(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

