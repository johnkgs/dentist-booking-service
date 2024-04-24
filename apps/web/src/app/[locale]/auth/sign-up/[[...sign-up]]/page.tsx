import { SignUp } from "@clerk/nextjs"

interface Props {
  params: { locale: string }
}

export default function Page(props: Props) {
  const {
    params: { locale }
  } = props
  return (
    <main className="flex min-h-screen items-center justify-center">
      <SignUp path={`/${locale}/auth/sign-up`} />
    </main>
  )
}
