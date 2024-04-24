import { ptBR } from "@clerk/localizations"
import { ClerkProvider } from "@clerk/nextjs"

import { I18nProviderClient } from "@repo/translation/client"
import { cn } from "@repo/ui/utils"

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
          elements: {
            formButtonPrimary: cn(
              "bg-primary text-primary-foreground !shadow-none hover:bg-primary/90",
              "h-10 px-4 py-2"
            )
          }
        }}
      >
        {children}
      </ClerkProvider>
    </I18nProviderClient>
  )
}
