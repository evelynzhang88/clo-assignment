import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks'
import { loadContent, applyFilters } from './store/slices/contentSlice'
import { useUrlState } from './hooks/useUrlState'
import Header from './components/Header'
import KeywordSearch from './components/KeywordSearch'
import PricingFilter from './components/PricingFilter'
import PricingSlider from './components/PricingSlider'
import ResetButton from './components/ResetButton'
import SortDropdown from './components/SortDropdown'
import ContentList from './components/ContentList'
import './App.scss'

function App() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((state) => state.content.filters)
  const items = useAppSelector((state) => state.content.items)

  // Load URL state and sync with Redux
  useUrlState()

  // Load content on mount
  useEffect(() => {
    dispatch(loadContent())
  }, [dispatch])

  // Apply filters whenever filters or items change
  useEffect(() => {
    if (items.length > 0) {
      dispatch(applyFilters())
    }
  }, [dispatch, filters, items.length])

  return (
    <div className="App">
      <Header />
      <div className="app-content">
        <KeywordSearch />
        <div className="filters-section">
          <PricingFilter />
          <div className="slider-reset-group">
            <PricingSlider />
            <ResetButton />
          </div>
          <SortDropdown />
        </div>
        <ContentList />
      </div>
    </div>
  )
}

export default App

