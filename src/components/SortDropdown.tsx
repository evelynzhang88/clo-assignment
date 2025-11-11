import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters } from '../store/slices/contentSlice'
import type { SortOption } from '../types/content'
import './SortDropdown.scss'

const SORT_OPTIONS: SortOption[] = ['Relevance', 'Item Name', 'Higher Price', 'Lower Price']

export default function SortDropdown() {
  const dispatch = useAppDispatch()
  const sortBy = useAppSelector((state) => state.content.filters.sortBy)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFilters({ sortBy: e.target.value as SortOption }))
  }

  return (
    <div className="sort-dropdown">
      <h3>Sort By</h3>
      <select
        value={sortBy}
        onChange={handleChange}
        className="sort-select"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

