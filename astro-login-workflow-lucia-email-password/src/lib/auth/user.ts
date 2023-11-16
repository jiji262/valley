import { auth } from '../../lib/auth/lucia'

// create a user in the db
export async function createUser(
  email: string,
  password: string
) {
  const user = await auth.createUser({
    key: {
      providerId: 'email', // auth method
      providerUserId: email.toLowerCase(), // unique id when using "username" auth method
      password, // hashed by Lucia
    },
    attributes: {
      email,
      email_verified: true,
    },
  })
  return user
}
