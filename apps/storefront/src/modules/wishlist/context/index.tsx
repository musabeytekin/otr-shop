"use client"

import {
  addToWishlist,
  removeFromWishlist,
  retrieveWishlistIds,
} from "@lib/data/wishlist"
import { useParams, useRouter } from "next/navigation"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type WishlistContextValue = {
  isSaved: (productId: string) => boolean
  isPending: (productId: string) => boolean
  toggle: (productId: string) => Promise<string | null>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export const WishlistProvider = ({
  signedIn,
  children,
}: {
  signedIn: boolean
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!signedIn) {
      return
    }

    retrieveWishlistIds().then((saved) => setIds(new Set(saved ?? [])))
  }, [signedIn])

  const toggle = useCallback(
    async (productId: string) => {
      if (!signedIn) {
        router.push(`/${countryCode}/account`)
        return null
      }

      const wasSaved = ids.has(productId)

      setPending((prev) => new Set(prev).add(productId))

      const result = wasSaved
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId)

      setPending((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })

      if (!result.success) {
        return result.error ?? "Something went wrong. Please try again."
      }

      setIds((prev) => {
        const next = new Set(prev)
        if (wasSaved) {
          next.delete(productId)
        } else {
          next.add(productId)
        }
        return next
      })
      router.refresh()

      return null
    },
    [signedIn, ids, router, countryCode]
  )

  const value = useMemo(
    () => ({
      isSaved: (productId: string) => signedIn && ids.has(productId),
      isPending: (productId: string) => pending.has(productId),
      toggle,
    }),
    [ids, pending, toggle, signedIn]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }

  return context
}
