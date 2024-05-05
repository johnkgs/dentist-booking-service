import { Protect } from "@clerk/nextjs"

export default function FrontDeskLayout({ children }: React.PropsWithChildren) {
  return (
    <Protect
      permission="org:reception:manage"
      // TODO: Tela de 401
      fallback={<div>Unauthorized</div>}
    >
      {children}
    </Protect>
  )
}
