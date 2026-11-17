"use client"

import { useActionState } from "react"
import { requestPasswordReset } from "@lib/data/customer"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ForgotPassword = () => {
  const [state, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="forgot-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Reset your password</h1>
      {state?.sent ? (
        <p
          className="text-center text-base-regular text-ui-fg-base mb-8"
          data-testid="forgot-password-sent"
        >
          If an account exists for that email, we sent a link to reset the
          password.
        </p>
      ) : (
        <>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Enter your email and we will send you a link to choose a new
            password.
          </p>
          <form className="w-full" action={formAction}>
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              data-testid="email-input"
            />
            <SubmitButton
              data-testid="forgot-password-submit"
              className="w-full mt-6"
            >
              Send reset link
            </SubmitButton>
          </form>
        </>
      )}
      <LocalizedClientLink
        href="/account"
        className="underline text-small-regular mt-6"
      >
        Back to sign in
      </LocalizedClientLink>
    </div>
  )
}

export default ForgotPassword
