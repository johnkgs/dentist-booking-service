import { Header } from "./_components/header"
import { HideLayout } from "./_components/hide-layout"
import { Sidebar } from "./_components/sidebar"
import SyncUser from "./_components/sync-user"

export default function ProtectedLayout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SyncUser />

      <HideLayout>
        <Sidebar />
      </HideLayout>
      <div className="bg-neutral-50 transition-[padding] peer-first/sidebar:pl-16">
        <HideLayout>
          <Header />
        </HideLayout>

        {children}
      </div>
    </div>
  )
}
