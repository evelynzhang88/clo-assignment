import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { loadMoreItems } from '../store/slices/contentSlice'
import type { ContentItem } from '../types/content'
import './ContentList.scss'

function ContentCard({ item }: { item: ContentItem }) {
  return (
    <div className="content-card">
      <div className="content-photo">
        <img src={item.photo} alt={item.title} />
      </div>
      <div className="content-footer">
        <div className="content-info">
          <div className="content-title">{item.title}</div>
          <div className="content-user">{item.userName}</div>
        </div>
        <div className="content-pricing">
          {item.pricingOption === 'Paid' ? (
            <span className="price">${item.price?.toFixed(2)}</span>
          ) : (
            <span className="pricing-option">{item.pricingOption === 'Free' ? 'FREE' : item.pricingOption}</span>
          )}
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="content-card skeleton-card">
      <div className="content-photo skeleton-photo">
        <div className="skeleton-shimmer" />
      </div>
      <div className="content-footer">
        <div className="content-info">
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-user" />
        </div>
        <div className="skeleton-line skeleton-pricing" />
      </div>
    </div>
  )
}

export default function ContentList() {
  const dispatch = useAppDispatch()
  const { displayedItems, filteredItems, isLoading } = useAppSelector(
    (state) => state.content
  )
  const observerTarget = useRef<HTMLDivElement>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const hasMore = displayedItems.length < filteredItems.length

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true)
        dispatch(loadMoreItems())
        // Simulate loading delay for skeleton UI
        setTimeout(() => {
          setIsLoadingMore(false)
        }, 500)
      }
    },
    [hasMore, isLoadingMore, dispatch]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [handleObserver])

  if (isLoading && displayedItems.length === 0) {
    return (
      <div className="content-list">
        <div className="content-grid">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      </div>
    )
  }

  if (displayedItems.length === 0) {
    return (
      <div className="content-list-empty">
        <p>No content found matching your filters.</p>
      </div>
    )
  }

  // Show skeleton cards matching the grid columns (max 4)
  const skeletonCount = 4

  return (
    <div className="content-list">
      <div className="content-grid">
        {displayedItems.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
        {isLoadingMore &&
          Array.from({ length: skeletonCount }).map((_, index) => (
            <SkeletonCard key={`skeleton-loading-${index}`} />
          ))}
      </div>
      {hasMore && (
        <div ref={observerTarget} className="content-list-observer" />
      )}
    </div>
  )
}

