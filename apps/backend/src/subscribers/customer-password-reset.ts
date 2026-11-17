import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

// No email provider is configured yet, so the reset link is logged. Replace the
// log with a notification once a provider is available.
export default async function customerPasswordReset({
  event: { data },
  container,
}: SubscriberArgs<{
  entity_id: string
  actor_type: string
  token: string
}>) {
  if (data.actor_type !== "customer") {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const storefrontUrl = process.env.STOREFRONT_URL || "http://localhost:8000"
  const url = `${storefrontUrl}/dk/reset-password?token=${data.token}&email=${encodeURIComponent(
    data.entity_id
  )}`

  logger.info(`Password reset link for ${data.entity_id}: ${url}`)
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
