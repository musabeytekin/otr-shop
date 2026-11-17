import { Metadata } from "next"

import { listWishlistProducts } from "@lib/data/wishlist"
import WishlistGrid from "@modules/wishlist/components/wishlist-grid"

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Products you have saved.",
}

export default async function Wishlist(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const products = await listWishlistProducts(countryCode)

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">My Wishlist</h1>
        <p className="text-base-regular">
          Products you have saved for later.
        </p>
      </div>
      <WishlistGrid products={products} />
    </div>
  )
}
