import { lucia } from 'lucia'
import { astro } from 'lucia/middleware'
import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql'
import postgres from 'postgres'
const postgresDatabase = postgres(
  import.meta.env.DATABASE_URL
)

const dbConfig = {
  user: 'user',
  key: 'user_key',
  session: 'user_session',
}

export const auth = lucia({
  adapter: postgresAdapter(
    postgresDatabase,
    dbConfig
  ),

  env: import.meta.env.DEV ? 'DEV' : 'PROD',
  middleware: astro(),
  getUserAttributes: (data) => {
    return {
      email: data.email,
      emailVerified: Boolean(data.email_verified),
    }
  },
})

export type Auth = typeof auth
