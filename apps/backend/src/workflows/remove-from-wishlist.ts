import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { WishlistItemInput } from "./steps/add-wishlist-item"
import { removeWishlistItemStep } from "./steps/remove-wishlist-item"

export const removeFromWishlistWorkflow = createWorkflow(
  "remove-from-wishlist",
  (input: WishlistItemInput) => {
    removeWishlistItemStep(input)
    return new WorkflowResponse({})
  }
)
