import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { listWishlistProducts } from "@lib/data/wishlist"
import WishlistEmpty from "@modules/wishlist/components/wishlist-empty"
import WishlistItems from "@modules/wishlist/components/wishlist-items"

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Products you have saved.",
}

export default async function Wishlist(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const customer = await retrieveCustomer()

  if (!customer) {
    notFound()
  }

  const { products, failed } = await listWishlistProducts(countryCode)

  return (
    <div className="w-full" data-testid="wishlist-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">My Wishlist</h1>
        <p className="text-base-regular">
          Products you have saved, with their current prices.
        </p>
      </div>
      {failed ? (
        <div className="flex flex-col gap-y-2" data-testid="wishlist-failed">
          <p role="alert" className="text-base-regular">
            We could not load your wishlist. Please reload the page to try
            again.
          </p>
        </div>
      ) : products.length === 0 ? (
        <WishlistEmpty />
      ) : (
        <WishlistItems products={products} />
      )}
    </div>
  )
}
