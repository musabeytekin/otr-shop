import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col gap-y-4" data-testid="wishlist-empty">
      <p className="text-base-regular">
        Your wishlist is empty. Save products you like and they will show up
        here.
      </p>
      <LocalizedClientLink
        href="/store"
        className="text-base-regular underline"
      >
        Browse products
      </LocalizedClientLink>
    </div>
  )
}
