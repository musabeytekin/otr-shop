import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

type AddWishlistItemInput = {
  customer_id: string
  product_id: string
}

export const addWishlistItemStep = createStep(
  "add-wishlist-item",
  async (input: AddWishlistItemInput, { container }) => {
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    // Saving a product twice is a no-op, so each product appears only once.
    const [existing] = await service.listWishlistItems(input, { take: 1 })

    if (existing) {
      return new StepResponse(existing, null as string | null)
    }

    const item = await service.createWishlistItems(input)

    return new StepResponse(item, item.id as string | null)
  },
  async (itemId, { container }) => {
    if (!itemId) {
      return
    }

    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    await service.deleteWishlistItems(itemId)
  }
)
