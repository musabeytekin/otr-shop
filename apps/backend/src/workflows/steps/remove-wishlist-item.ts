import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"
import { WishlistItemInput } from "./add-wishlist-item"

export const removeWishlistItemStep = createStep(
  "remove-wishlist-item",
  async (input: WishlistItemInput, { container }) => {
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)
    const items = await service.listWishlistItems(input)

    if (items.length) {
      await service.deleteWishlistItems(items.map((i) => i.id))
    }

    return new StepResponse(undefined, items)
  },
  async (items, { container }) => {
    if (!items?.length) {
      return
    }
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)
    await service.createWishlistItems(
      items.map((i) => ({
        customer_id: i.customer_id,
        product_id: i.product_id,
      }))
    )
  }
)
