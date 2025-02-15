import { DefaultSession, DefaultUser } from "next-auth"
import "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      name?: string
      email?: string | null
    }
  }

  interface User extends DefaultUser {
    username?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string
  }
}
