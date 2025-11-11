import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters } from '../store/slices/contentSlice'
import './PricingSlider.scss'

const MIN_PRICE = 0
const MAX_PRICE = 999

export default function PricingSlider() {
  const dispatch = useAppDispatch()
  const priceRange = useAppSelector((state) => state.content.filters.priceRange)
  const isPaidSelected = useAppSelector((state) =>
    state.content.filters.pricingOptions.includes('Paid')
  )

  const [minValue, setMinValue] = useState(priceRange.min)
  const [maxValue, setMaxValue] = useState(priceRange.max)

  useEffect(() => {
    setMinValue(priceRange.min)
    setMaxValue(priceRange.max)
  }, [priceRange])

  const getPercentage = (value: number) => {
    return ((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100
  }

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value)
    // Ensure min doesn't exceed max - 1
    const clampedMin = Math.min(Math.max(newMin, MIN_PRICE), maxValue - 1)
    setMinValue(clampedMin)
    dispatch(setFilters({ priceRange: { min: clampedMin, max: maxValue } }))
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value)
    // Ensure max is at least min + 1
    const clampedMax = Math.max(Math.min(newMax, MAX_PRICE), minValue + 1)
    setMaxValue(clampedMax)
    dispatch(setFilters({ priceRange: { min: minValue, max: clampedMax } }))
  }

  if (!isPaidSelected) {
    return (
      <div className="pricing-slider disabled">
        <h3>Price Range</h3>
        <div className="slider-disabled-message">
          Select "Paid" option to enable price filtering
        </div>
      </div>
    )
  }

  const minPercent = getPercentage(minValue)
  const maxPercent = getPercentage(maxValue)

  return (
    <div className="pricing-slider">
      <h3>Price Range</h3>
      <div className="slider-container">
        <div className="slider-values">
          <span className="value-label">${minValue}</span>
          <span className="value-label">{maxValue === MAX_PRICE ? `$${MAX_PRICE}+` : `$${maxValue}`}</span>
        </div>
        <div className="slider-wrapper">
          <div className="slider-track">
            <div
              className="slider-range"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
          </div>
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={minValue}
            onChange={handleMinChange}
            className="slider-input slider-input-min"
          />
          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            value={maxValue}
            onChange={handleMaxChange}
            className="slider-input slider-input-max"
          />
        </div>
      </div>
    </div>
  )
}

