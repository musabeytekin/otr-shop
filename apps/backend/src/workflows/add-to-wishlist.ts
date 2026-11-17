import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { addWishlistItemStep } from "./steps/add-wishlist-item"

export const addToWishlistWorkflow = createWorkflow(
  "add-to-wishlist",
  (input: { customer_id: string; product_id: string }) => {
    const item = addWishlistItemStep(input)

    return new WorkflowResponse(item)
  }
)
