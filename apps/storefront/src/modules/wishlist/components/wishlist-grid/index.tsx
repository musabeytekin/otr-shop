"use client"

import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useWishlist } from "@modules/wishlist/context"
import { useState } from "react"

const WishlistGrid = ({ products }: { products: HttpTypes.StoreProduct[] }) => {
  const { toggle, isPending } = useWishlist()
  const [removed, setRemoved] = useState<Set<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})

  const visible = products.filter((product) => !removed.has(product.id!))

  const handleRemove = async (productId: string) => {
    setErrors(({ [productId]: _cleared, ...rest }) => rest)
    const error = await toggle(productId)

    if (error) {
      setErrors((prev) => ({ ...prev, [productId]: error }))
      return
    }

    setRemoved((prev) => new Set(prev).add(productId))
  }

  if (!visible.length) {
    return (
      <div
        className="flex flex-col items-start gap-y-4"
        data-testid="wishlist-empty"
      >
        <Text className="text-base-regular">
          Your wishlist is empty. Save products you like and they will show up
          here.
        </Text>
        <LocalizedClientLink
          href="/store"
          className="text-base-regular underline"
          data-testid="wishlist-browse-link"
        >
          Browse products
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <ul
      className="grid grid-cols-2 medium:grid-cols-3 gap-x-4 gap-y-8"
      data-testid="wishlist-grid"
    >
      {visible.map((product) => {
        const { cheapestPrice } = getProductPrice({ product })

        return (
          <li key={product.id} data-testid="wishlist-item">
            <LocalizedClientLink href={`/products/${product.handle}`}>
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                alt={product.title}
                size="full"
              />
              <div className="mt-2 flex justify-between gap-x-2 txt-compact-medium">
                <Text className="text-ui-fg-subtle">{product.title}</Text>
                {cheapestPrice && (
                  <Text className="text-ui-fg-muted">
                    {cheapestPrice.calculated_price}
                  </Text>
                )}
              </div>
            </LocalizedClientLink>
            <button
              type="button"
              onClick={() => handleRemove(product.id!)}
              disabled={isPending(product.id!)}
              className="mt-2 text-small-regular text-ui-fg-subtle underline hover:text-ui-fg-base disabled:opacity-50"
              data-testid="wishlist-remove"
            >
              Remove
            </button>
            {errors[product.id!] && (
              <p role="alert" className="text-small-regular text-ui-fg-error">
                {errors[product.id!]} Press Remove to retry.
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default WishlistGrid
