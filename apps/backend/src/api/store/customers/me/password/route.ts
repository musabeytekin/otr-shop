import { MedusaResponse } from "@medusajs/framework/http"
import type { AuthenticatedMedusaRequest } from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { changeCustomerPasswordWorkflow } from "../../../../../workflows/change-customer-password"
import { z } from "@medusajs/framework/zod"

export const ChangePasswordSchema = z.object({
  old_password: z.string().min(1),
  new_password: z.string().min(8),
})

type ChangePasswordBody = z.infer<typeof ChangePasswordSchema>

// Changes the password of the signed-in customer after checking the old one.
export async function POST(
  req: AuthenticatedMedusaRequest<ChangePasswordBody>,
  res: MedusaResponse
) {
  const { old_password, new_password } = req.validatedBody
  const customerId = req.auth_context.actor_id

  const customerService = req.scope.resolve(Modules.CUSTOMER)
  const authService = req.scope.resolve(Modules.AUTH)

  const customer = await customerService.retrieveCustomer(customerId)

  const { success } = await authService.authenticate("emailpass", {
    body: { email: customer.email, password: old_password },
  } as any)

  if (!success) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "The current password is incorrect"
    )
  }

  const { result: update } = await changeCustomerPasswordWorkflow(req.scope).run({
    input: { email: customer.email, password: new_password },
  })

  if (!update.success) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      update.error || "Could not update the password"
    )
  }

  res.json({ success: true })
}
