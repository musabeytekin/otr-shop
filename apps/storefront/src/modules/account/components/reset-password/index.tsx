"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"
import { resetPassword } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""
  const [state, formAction] = useActionState(resetPassword, null)

  if (state?.success) {
    return (
      <div
        className="max-w-sm w-full flex flex-col items-center gap-y-4"
        data-testid="reset-password-success"
      >
        <h1 className="text-large-semi uppercase">Password updated</h1>
        <p className="text-center text-base-regular">
          You can now sign in with your new password.
        </p>
        <LocalizedClientLink href="/account" className="underline">
          Go to sign in
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Choose a new password</h1>
      <form className="w-full" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="email" value={email} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="new-password-input"
          />
          <Input
            label="Confirm password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="confirm-password-input"
          />
        </div>
        <ErrorMessage
          error={state?.error}
          data-testid="reset-password-error"
        />
        <SubmitButton data-testid="reset-password-submit" className="w-full mt-6">
          Update password
        </SubmitButton>
      </form>
    </div>
  )
}

export default ResetPassword
