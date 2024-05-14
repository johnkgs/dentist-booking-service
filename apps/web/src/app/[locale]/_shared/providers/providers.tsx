import { ptBR } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"
import { Provider } from "jotai"

import { I18nProviderClient } from "@repo/translation/client"

import { ConvexClientProvider } from "./convex-client-provider"

interface Props {
  locale: string
}

export function Providers(props: React.PropsWithChildren<Props>) {
  const { children, locale } = props
  const redirectUrl = `/${locale}/home`

  return (
    <I18nProviderClient locale={locale}>
      <ClerkProvider
        localization={ptBR}
        signInFallbackRedirectUrl={redirectUrl}
        signUpFallbackRedirectUrl={redirectUrl}
        appearance={{
          variables: {
            colorPrimary: "hsl(221.2, 83.2%, 53.3%)"
          }
        }}
      >
        <ConvexClientProvider>
          <Provider>{children}</Provider>
        </ConvexClientProvider>
      </ClerkProvider>
    </I18nProviderClient>
  )
}
