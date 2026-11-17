"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { formatDayRange, StorePolicies } from "@lib/util/store-policies"
import { formatShippingRate } from "@modules/policies/templates"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
  policies?: StorePolicies | null
  currencyCode?: string
}

const ProductTabs = ({
  product,
  policies = null,
  currencyCode = "",
}: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab policies={policies} currencyCode={currencyCode} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = ({
  policies,
  currencyCode,
}: {
  policies: StorePolicies | null
  currencyCode: string
}) => {
  if (!policies) {
    return (
      <div className="text-small-regular py-8">
        <p className="max-w-sm">
          See our{" "}
          <LocalizedClientLink href="/shipping" className="underline">
            shipping
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink href="/returns" className="underline">
            return
          </LocalizedClientLink>{" "}
          policies for details.
        </p>
      </div>
    )
  }

  return (
    <div className="text-small-regular py-8">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-2">
          <FastDelivery />
          <div>
            <span className="font-semibold">Shipping</span>
            <p className="max-w-sm">
              Shipping rate:{" "}
              {formatShippingRate(policies.shippingRate, currencyCode)}. Orders
              are processed in {formatDayRange(policies.handlingDays)} business
              days and delivered within {formatDayRange(policies.transitDays)}{" "}
              business days after dispatch.{" "}
              <LocalizedClientLink href="/shipping" className="underline">
                Shipping information
              </LocalizedClientLink>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2">
          <Back />
          <div>
            <span className="font-semibold">Returns</span>
            <p className="max-w-sm">
              You can return items within {policies.returnWindowDays} days of
              delivery.{" "}
              {policies.freeReturns
                ? "Return shipping is free."
                : "Return shipping costs are paid by the customer."}{" "}
              <LocalizedClientLink href="/returns" className="underline">
                Return policy
              </LocalizedClientLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
