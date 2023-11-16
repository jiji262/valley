import { auth } from '../lib/auth/lucia'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async (context) => {
  const session =
    await context.locals.auth.validate()

  //handle no session
  if (!session) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  // invalidate the current session
  await auth.invalidateSession(session.sessionId)

  // delete session cookie
  context.locals.auth.setSession(null)

  // redirect to login
  return context.redirect('/auth/login', 302)
}
