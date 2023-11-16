import { auth } from '../../lib/auth/lucia'

// initialize a session for the user credentials and set the cookie
export async function createSession(
  email: string,
  password: string
) {
  // get the user from credentials
  const key = await auth.useKey(
    'email',
    email.toLowerCase(),
    password
  )

  // init the session
  const session = await auth.createSession({
    userId: key.userId,
    attributes: {},
  })
  console.log(session)
  return session
}
