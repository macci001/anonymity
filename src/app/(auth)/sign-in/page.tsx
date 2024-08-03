"use client"

import { useSession } from "next-auth/react"
import { signIn } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }

  return <button onClick={() => signIn()}>
    SignIn
  </button>
}