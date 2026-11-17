"use client"

import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PreviewPrice from "@modules/products/components/product-preview/price"
import Thumbnail from "@modules/products/components/thumbnail"
import { Text } from "@modules/common/components/ui"
import WishlistEmpty from "./wishlist-empty"
import { useState } from "react"
import { useWishlist } from "./wishlist-provider"

const WishlistItem = ({
  product,
  onRemoved,
}: {
  product: HttpTypes.StoreProduct
  onRemoved: () => void
}) => {
  const { isPending, toggle } = useWishlist()
  const [error, setError] = useState<string | null>(null)
  const { cheapestPrice } = getProductPrice({ product })

  const handleRemove = async () => {
    setError(null)
    const result = await toggle(product.id)
    if (result) {
      setError(result)
    } else {
      onRemoved()
    }
  }

  return (
    <li data-testid="wishlist-item">
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group"
      >
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          alt={product.title}
          size="full"
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="wishlist-item-title">
            {product.title}
          </Text>
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </LocalizedClientLink>
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending(product.id)}
        className="mt-2 text-small-regular text-ui-fg-subtle underline hover:text-ui-fg-base disabled:opacity-60"
        data-testid="wishlist-remove"
      >
        {error ? "Try again" : "Remove"}
      </button>
      {error && (
        <p role="alert" className="text-small-regular text-ui-fg-error">
          {error}
        </p>
      )}
    </li>
  )
}

export default function WishlistItems({
  products,
}: {
  products: HttpTypes.StoreProduct[]
}) {
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const remaining = products.filter((p) => !removedIds.includes(p.id))

  if (!remaining.length) {
    return <WishlistEmpty />
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 small:grid-cols-3">
      {remaining.map((product) => (
        <WishlistItem
          key={product.id}
          product={product}
          onRemoved={() => setRemovedIds((prev) => [...prev, product.id])}
        />
      ))}
    </ul>
  )
}
