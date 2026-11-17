import { Metadata } from "next"

import { STORE_NAME } from "@lib/util/site"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { PolicyPage } from "@modules/policies/templates"

export const dynamic = "force-static"
export const revalidate = 60

export const metadata: Metadata = {
  title: "Customer service",
  description: `Answers to frequently asked questions about ${STORE_NAME}.`,
}

const FAQ = [
  {
    question: "How much does shipping cost and how long does it take?",
    answer: "Rates and delivery times for your region are on our",
    href: "/shipping",
    label: "shipping information page",
  },
  {
    question: "How do I return an item?",
    answer: "Our return conditions are described on the",
    href: "/returns",
    label: "returns page",
  },
  {
    question: "How do I contact you about an order?",
    answer: "Include your order number when you reach us through the",
    href: "/contact",
    label: "contact page",
  },
]

export default function CustomerServicePage() {
  return (
    <PolicyPage title="Customer service">
      <p>Answers to frequently asked questions.</p>
      {FAQ.map((item) => (
        <div key={item.href}>
          <h2 className="text-large-semi mb-1">{item.question}</h2>
          <p>
            {item.answer}{" "}
            <LocalizedClientLink
              href={item.href}
              className="text-ui-fg-interactive"
            >
              {item.label}
            </LocalizedClientLink>
            .
          </p>
        </div>
      ))}
    </PolicyPage>
  )
}
