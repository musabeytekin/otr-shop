"use client"

import { clx } from "@modules/common/components/ui"
import { MouseEvent, useState } from "react"
import { useWishlist } from "./wishlist-provider"

type WishlistButtonProps = {
  productId: string
  productTitle: string
  // "overlay" sits in the corner of a product card, "inline" is a labelled button.
  variant?: "overlay" | "inline"
  className?: string
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export default function WishlistButton({
  productId,
  productTitle,
  variant = "overlay",
  className,
}: WishlistButtonProps) {
  const { isSaved, isPending, toggle } = useWishlist()
  const [error, setError] = useState<string | null>(null)
  const saved = isSaved(productId)
  const pending = isPending(productId)

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    // The overlay lives inside a product link.
    event.preventDefault()
    event.stopPropagation()
    setError(null)
    setError(await toggle(productId))
  }

  const label = saved
    ? `Remove ${productTitle} from wishlist`
    : `Save ${productTitle} to wishlist`

  return (
    <div
      className={clx(
        variant === "overlay" ? "absolute top-2 right-2 z-10" : "",
        className
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={saved}
        aria-label={label}
        title={saved ? "Remove from wishlist" : "Save to wishlist"}
        data-testid="wishlist-button"
        className={clx(
          "inline-flex items-center justify-center gap-x-2 transition-colors disabled:opacity-60",
          variant === "overlay"
            ? "h-10 w-10 rounded-full bg-white/90 shadow-elevation-card-rest hover:bg-white"
            : "h-10 w-full rounded-rounded border border-ui-border-base px-4 txt-compact-medium hover:bg-ui-bg-base-hover",
          saved ? "text-red-500" : "text-ui-fg-subtle"
        )}
      >
        <HeartIcon filled={saved} />
        {variant === "inline" && (
          <span>{saved ? "Saved to wishlist" : "Save to wishlist"}</span>
        )}
      </button>
      {error && (
        <p
          role="alert"
          className="mt-1 rounded-rounded bg-white px-2 py-1 text-small-regular text-ui-fg-error shadow-elevation-card-rest"
          data-testid="wishlist-error"
        >
          {error} <span className="underline">Tap the heart to retry.</span>
        </p>
      )}
    </div>
  )
}
