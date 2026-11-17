"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { listProducts } from "./products"

export type WishlistResult =
  | { success: true; productIds: string[] }
  | { success: false; error: string }

// Saved product ids of the signed-in customer, or null when signed out.
export const retrieveWishlistIds = async (): Promise<string[] | null> => {
  const headers = await getAuthHeaders()

  if (!("authorization" in headers)) {
    return null
  }

  return sdk.client
    .fetch<{ product_ids: string[] }>("/store/customers/me/wishlist", {
      method: "GET",
      headers,
      cache: "no-store",
    })
    .then(({ product_ids }) => product_ids)
    .catch(() => null)
}

export const addToWishlist = async (
  productId: string
): Promise<{ success: boolean; error?: string }> => {
  const headers = await getAuthHeaders()

  return sdk.client
    .fetch("/store/customers/me/wishlist", {
      method: "POST",
      headers,
      body: { product_id: productId },
    })
    .then(() => ({ success: true }))
    .catch(() => ({
      success: false,
      error: "We could not save this product. Please try again.",
    }))
}

export const removeFromWishlist = async (
  productId: string
): Promise<{ success: boolean; error?: string }> => {
  const headers = await getAuthHeaders()

  return sdk.client
    .fetch(`/store/customers/me/wishlist/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      headers,
    })
    .then(() => ({ success: true }))
    .catch(() => ({
      success: false,
      error: "We could not remove this product. Please try again.",
    }))
}

// Saved products with prices for the region. Products that are no longer
// available in the store are not returned by the store API and so are skipped.
export const listWishlistProducts = async (
  countryCode: string
): Promise<HttpTypes.StoreProduct[]> => {
  const ids = await retrieveWishlistIds()

  if (!ids?.length) {
    return []
  }

  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: { id: ids, limit: 100 },
  })

  const order = new Map(ids.map((id, index) => [id, index]))

  return products.sort((a, b) => order.get(a.id!)! - order.get(b.id!)!)
}
