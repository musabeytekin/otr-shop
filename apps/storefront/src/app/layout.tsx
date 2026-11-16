import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const themeScript = `try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.setAttribute("data-mode",t);r.style.colorScheme=t}catch(e){}`

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body className="bg-ui-bg-base text-ui-fg-base">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
