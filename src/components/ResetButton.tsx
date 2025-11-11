import { useAppDispatch } from '../store/hooks'
import { resetFilters } from '../store/slices/contentSlice'
import './ResetButton.scss'

export default function ResetButton() {
  const dispatch = useAppDispatch()

  const handleReset = () => {
    dispatch(resetFilters())
  }

  return (
    <button className="reset-button" onClick={handleReset}>
      RESET
    </button>
  )
}

