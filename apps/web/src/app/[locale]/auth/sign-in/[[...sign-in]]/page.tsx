import { SignIn } from "@clerk/nextjs"

interface Props {
  params: { locale: string }
}

export default function Page(props: Props) {
  const {
    params: { locale }
  } = props
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignIn path={`/${locale}/auth/sign-in`} />
    </main>
  )
}
