"use client"

import { clx } from "@modules/common/components/ui"
import { useWishlist } from "@modules/wishlist/context"
import { useState } from "react"

const WishlistButton = ({
  productId,
  className,
}: {
  productId: string
  className?: string
}) => {
  const { isSaved, isPending, toggle } = useWishlist()
  const [error, setError] = useState<string | null>(null)
  const saved = isSaved(productId)

  const handleClick = async () => {
    setError(null)
    setError(await toggle(productId))
  }

  return (
    <div className={clx("flex flex-col items-end gap-y-1", className)}>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending(productId)}
        aria-pressed={saved}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        title={saved ? "Remove from wishlist" : "Save to wishlist"}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-borders-base transition-colors hover:bg-white disabled:opacity-50"
        data-testid="wishlist-button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={saved ? "text-ui-fg-interactive" : "text-ui-fg-subtle"}
          aria-hidden="true"
        >
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      </button>
      {error && (
        <span
          role="alert"
          className="rounded bg-white px-2 py-1 text-small-regular text-ui-fg-error shadow-borders-base"
          data-testid="wishlist-error"
        >
          {error} Tap the heart to retry.
        </span>
      )}
    </div>
  )
}

export default WishlistButton
