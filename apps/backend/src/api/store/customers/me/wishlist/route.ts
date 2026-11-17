import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { z } from "@medusajs/framework/zod"
import { WISHLIST_MODULE } from "../../../../../modules/wishlist"
import WishlistModuleService from "../../../../../modules/wishlist/service"
import { addToWishlistWorkflow } from "../../../../../workflows/add-to-wishlist"

export const PostWishlistSchema = z.object({
  product_id: z.string().min(1),
})

// Returns the signed-in customer's saved product ids, newest first.
export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const service: WishlistModuleService = req.scope.resolve(WISHLIST_MODULE)

  const items = await service.listWishlistItems(
    { customer_id: req.auth_context.actor_id },
    { order: { created_at: "DESC" } }
  )

  res.json({ product_ids: items.map((item) => item.product_id) })
}

export async function POST(
  req: AuthenticatedMedusaRequest<z.infer<typeof PostWishlistSchema>>,
  res: MedusaResponse
) {
  await addToWishlistWorkflow(req.scope).run({
    input: {
      customer_id: req.auth_context.actor_id,
      product_id: req.validatedBody.product_id,
    },
  })

  res.status(200).json({ product_id: req.validatedBody.product_id })
}
