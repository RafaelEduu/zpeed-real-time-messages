'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function Login() {
  const session = useSession()

  if(session.status === "unauthenticated"){
    return (
      <button onClick={() => signIn("google")}>Entrar</button>
    )
  }

  if(session.status === "authenticated"){

    return (
      <button onClick={() => signOut()}>Sair</button>
    )
  }
}