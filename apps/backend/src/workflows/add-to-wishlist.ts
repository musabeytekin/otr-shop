import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { addWishlistItemStep, WishlistItemInput } from "./steps/add-wishlist-item"

export const addToWishlistWorkflow = createWorkflow(
  "add-to-wishlist",
  (input: WishlistItemInput) => {
    const item = addWishlistItemStep(input)
    return new WorkflowResponse(item)
  }
)
