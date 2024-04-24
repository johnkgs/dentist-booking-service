import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";

import { cn } from "@repo/ui/utils";

export function Providers(props: React.PropsWithChildren) {
  const { children } = props;

  return (
    <ClerkProvider
      localization={ptBR}
      appearance={{
        elements: {
          formButtonPrimary: cn(
            "bg-primary text-primary-foreground !shadow-none hover:bg-primary/90",
            "h-10 px-4 py-2",
          ),
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
