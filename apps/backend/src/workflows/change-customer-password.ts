import { Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

type ChangeCustomerPasswordInput = {
  email: string
  password: string
}

const updatePassword = createStep(
  "update-password",
  async ({ email, password }: ChangeCustomerPasswordInput, { container }) => {
    const authService = container.resolve(Modules.AUTH)

    const result = await authService.updateProvider("emailpass", {
      entity_id: email,
      password,
    })

    return new StepResponse({ success: result.success, error: result.error })
  }
)

export const changeCustomerPasswordWorkflow = createWorkflow(
  "change-customer-password",
  (input: ChangeCustomerPasswordInput) => {
    const result = updatePassword(input)
    return new WorkflowResponse(result)
  }
)
