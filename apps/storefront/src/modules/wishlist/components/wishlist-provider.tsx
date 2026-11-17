"use client"

import {
  addToWishlist,
  getWishlistState,
  removeFromWishlist,
} from "@lib/data/wishlist"
import { useParams, usePathname, useRouter } from "next/navigation"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

type WishlistContextValue = {
  isSaved: (productId: string) => boolean
  isPending: (productId: string) => boolean
  // Resolves to an error message, or null on success.
  toggle: (productId: string) => Promise<string | null>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export const useWishlist = () => {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return ctx
}

export default function WishlistProvider({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const { countryCode } = useParams() as { countryCode: string }
  const [saved, setSaved] = useState<Set<string>>(() => new Set())
  const [signedIn, setSignedIn] = useState(false)
  const pathname = usePathname()
  const [pending, setPending] = useState<Set<string>>(() => new Set())

  // Reload on navigation so signing in or out is picked up.
  useEffect(() => {
    let cancelled = false
    getWishlistState().then((state) => {
      if (cancelled) return
      setSignedIn(state.signedIn)
      setSaved(new Set(state.productIds))
    })
    return () => {
      cancelled = true
    }
  }, [pathname])

  const setMembership = (productId: string, value: boolean) =>
    setSaved((prev) => {
      const next = new Set(prev)
      if (value) next.add(productId)
      else next.delete(productId)
      return next
    })

  const toggle = useCallback(
    async (productId: string) => {
      if (!signedIn) {
        router.push(`/${countryCode}/account`)
        return null
      }

      const wasSaved = saved.has(productId)
      setPending((prev) => new Set(prev).add(productId))
      // Optimistic update, rolled back if the request fails.
      setMembership(productId, !wasSaved)

      const result = wasSaved
        ? await removeFromWishlist(productId)
        : await addToWishlist(productId)

      setPending((prev) => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })

      if (!result.ok) {
        setMembership(productId, wasSaved)
        return result.error
      }

      return null
    },
    [signedIn, saved, router, countryCode]
  )

  return (
    <WishlistContext.Provider
      value={{
        isSaved: (id) => saved.has(id),
        isPending: (id) => pending.has(id),
        toggle,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}
