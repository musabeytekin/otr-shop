import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { WISHLIST_MODULE } from "../../modules/wishlist"
import WishlistModuleService from "../../modules/wishlist/service"

export type WishlistItemInput = {
  customer_id: string
  product_id: string
}

export const addWishlistItemStep = createStep(
  "add-wishlist-item",
  async (input: WishlistItemInput, { container }) => {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)

    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id"],
      filters: { id: input.product_id, status: "published" },
    })

    if (!products.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product ${input.product_id} was not found`
      )
    }

    // Saving the same product twice is a no-op.
    const [existing] = await service.listWishlistItems(input, { take: 1 })

    if (existing) {
      return new StepResponse(existing)
    }

    try {
      const item = await service.createWishlistItems(input)
      return new StepResponse(item, item.id)
    } catch (e) {
      // A concurrent request may have created it between the check and insert.
      const [created] = await service.listWishlistItems(input, { take: 1 })
      if (created) {
        return new StepResponse(created)
      }
      throw e
    }
  },
  async (id, { container }) => {
    if (!id) {
      return
    }
    const service: WishlistModuleService = container.resolve(WISHLIST_MODULE)
    await service.deleteWishlistItems(id)
  }
)
