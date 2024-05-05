export {}

declare global {
  interface ClerkAuthorization {
    permission: "org:patient:manage" | "org:reception:manage"
    role: "org:admin" | "org:attendant" | "org:doctor"
  }
}
