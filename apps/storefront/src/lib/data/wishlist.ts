"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { getRegion } from "./regions"

export type WishlistActionResult = { ok: true } | { ok: false; error: string }

const MAX_PRODUCTS = 100

// Read on the client because product pages are statically rendered and so
// cannot know who is signed in.
export const getWishlistState = async (): Promise<{
  signedIn: boolean
  productIds: string[]
}> => {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return { signedIn: false, productIds: [] }
  }

  return sdk.client
    .fetch<{ product_ids: string[] }>(`/store/customers/me/wishlist`, {
      method: "GET",
      headers,
      cache: "no-store",
    })
    .then(({ product_ids }) => ({ signedIn: true, productIds: product_ids }))
    .catch(() => ({ signedIn: true, productIds: [] }))
}

// Saved products with prices for the country's region. Products that are no
// longer published (or not in the store's sales channel) are not returned.
export const listWishlistProducts = async (
  countryCode: string
): Promise<{ products: HttpTypes.StoreProduct[]; failed: boolean }> => {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return { products: [], failed: false }
  }

  try {
    const { product_ids } = await sdk.client.fetch<{ product_ids: string[] }>(
      `/store/customers/me/wishlist`,
      { method: "GET", headers, cache: "no-store" }
    )
    const ids = product_ids.slice(0, MAX_PRODUCTS)
    const region = await getRegion(countryCode)

    if (!ids.length || !region) {
      return { products: [], failed: false }
    }

    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>(`/store/products`, {
      method: "GET",
      query: {
        id: ids,
        limit: ids.length,
        region_id: region.id,
        fields: "*variants.calculated_price,+thumbnail,*images",
      },
      headers,
      cache: "no-store",
    })

    const byId = new Map(products.map((p) => [p.id, p]))
    return {
      products: ids.flatMap((id) => byId.get(id) ?? []),
      failed: false,
    }
  } catch {
    return { products: [], failed: true }
  }
}

export const addToWishlist = async (
  productId: string
): Promise<WishlistActionResult> => {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return { ok: false, error: "Please sign in to save products." }
  }

  return sdk.client
    .fetch(`/store/customers/me/wishlist`, {
      method: "POST",
      body: { product_id: productId },
      headers,
    })
    .then((): WishlistActionResult => ({ ok: true }))
    .catch(
      (): WishlistActionResult => ({
        ok: false,
        error: "We could not save this product. Please try again.",
      })
    )
}

export const removeFromWishlist = async (
  productId: string
): Promise<WishlistActionResult> => {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return { ok: false, error: "Please sign in to manage your wishlist." }
  }

  return sdk.client
    .fetch(`/store/customers/me/wishlist/${productId}`, {
      method: "DELETE",
      headers,
    })
    .then((): WishlistActionResult => ({ ok: true }))
    .catch(
      (): WishlistActionResult => ({
        ok: false,
        error: "We could not remove this product. Please try again.",
      })
    )
}
