import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

type RemoveWishlistItemInput = {
  customer_id: string
  product_id: string
}

export const removeWishlistItemStep = createStep(
  "remove-wishlist-item",
  async (input: RemoveWishlistItemInput, { container }) => {
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    const items = await service.listWishlistItems(input)

    if (items.length) {
      await service.deleteWishlistItems(items.map((item) => item.id))
    }

    return new StepResponse(undefined, items)
  },
  async (items, { container }) => {
    if (!items?.length) {
      return
    }

    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    await service.createWishlistItems(
      items.map(({ customer_id, product_id }) => ({ customer_id, product_id }))
    )
  }
)
