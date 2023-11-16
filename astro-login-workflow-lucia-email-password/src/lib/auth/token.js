import { db } from '../db'
import {
  generateRandomString,
  isWithinExpiration,
} from 'lucia/utils'

const EXPIRES_IN = 1000 * 60 * 60 * 2 // 2 hours

export async function generatePasswordResetToken(
  userId
) {
  const token = generateRandomString(63)
  await db
    .insertInto('password_reset_token')
    .values({
      id: token,
      expires: new Date().getTime() + EXPIRES_IN,
      user_id: userId,
    })
    .execute()
  return token
}

export async function isValidPasswordResetToken(
  token
) {
  const storedToken = await db
    .selectFrom('password_reset_token')
    .selectAll()
    .where('id', '=', token)
    .executeTakeFirst()
  if (!storedToken) return false
  const tokenExpires = Number(storedToken.expires) // bigint => number conversion
  if (!isWithinExpiration(tokenExpires)) {
    return false
  }
  return true
}

export async function fetchUserIdFromPasswordResetToken(
  token
) {
  const storedToken = await db
    .transaction()
    .execute(async (trx) => {
      const storedToken = await trx
        .selectFrom('password_reset_token')
        .selectAll()
        .where('id', '=', token)
        .executeTakeFirst()
      if (!storedToken)
        throw new Error('Invalid token')
      await trx
        .deleteFrom('password_reset_token')
        .where('id', '=', token)
        .executeTakeFirst()
      return storedToken
    })
  const tokenExpires = Number(storedToken.expires) // bigint => number conversion
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error('Expired token')
  }
  return storedToken.user_id
}
