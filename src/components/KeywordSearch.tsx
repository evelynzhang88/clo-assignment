import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setFilters } from '../store/slices/contentSlice'
import './KeywordSearch.scss'

export default function KeywordSearch() {
  const dispatch = useAppDispatch()
  const keyword = useAppSelector((state) => state.content.filters.keyword)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFilters({ keyword: e.target.value }))
  }

  return (
    <div className="keyword-search">
      <input
        type="text"
        placeholder="Find the Items you're lookng for"
        value={keyword}
        onChange={handleChange}
        className="search-input"
      />
      <div className="search-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

