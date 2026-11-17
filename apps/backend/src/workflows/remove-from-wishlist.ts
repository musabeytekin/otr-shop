import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { removeWishlistItemStep } from "./steps/remove-wishlist-item"

export const removeFromWishlistWorkflow = createWorkflow(
  "remove-from-wishlist",
  (input: { customer_id: string; product_id: string }) => {
    removeWishlistItemStep(input)

    return new WorkflowResponse({ product_id: input.product_id })
  }
)
